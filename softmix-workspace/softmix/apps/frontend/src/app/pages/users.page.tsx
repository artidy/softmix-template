import { FormEvent, MouseEvent, ReactElement, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '../hooks';
import { getIsCreateMode, getIsUserEditLoading, getUser, getUserEdit, getUsers } from '../store/user-data/selectors';
import { deleteUserApi, getApiUsers, getEditUserApi } from '../store/user-data/api-actions';
import { setCreateMode, setUserEdit, setUsers } from '../store/user-data/user-data';
import { formatDate } from '../services/helpers';
import Modal from '../components/modal/modal.component';
import LoaderComponent from '../components/loader/loader.component';
import AddUserComponent from '../components/add-user/add-user.component';
import DeleteControlFormComponent from '../components/delete-control-form/delete-control-form.component';

function UsersPage(): ReactElement {
  const dispatch = useAppDispatch();
  const users = useAppSelector(getUsers);
  const user = useAppSelector(getUser);
  const isUserEditLoading = useAppSelector(getIsUserEditLoading);
  const editUser = useAppSelector(getUserEdit);
  const isCreateMode = useAppSelector(getIsCreateMode);
  const [userToDelete, setUserToDelete] = useState<{ id: string; login: string } | null>(null);

  useEffect(() => {
    dispatch(getApiUsers());

    return () => {
      dispatch(setUsers([]));
    }
  }, []);

  const deleteHandler = (userId: string, login: string) => {
    return (evt: MouseEvent) => {
      evt.preventDefault();

      if (user.id === userId) {
        toast.error("Нельзя удалить своего пользователя!");

        return;
      }

      setUserToDelete({ id: userId, login });
    }
  }

  const closeDeleteModal = () => {
    setUserToDelete(null);
  }

  const confirmDelete = (evt: FormEvent) => {
    evt.preventDefault();

    if (userToDelete) {
      dispatch(deleteUserApi(userToDelete.id));
    }

    setUserToDelete(null);
  }

  const openEditModal = (id: string) => () => {
    dispatch(getEditUserApi(id));
  }

  const openCreateModal = () => {
    dispatch(setCreateMode(true));
  }

  const closeModal = () => {
    dispatch(setUserEdit(null));
    dispatch(setCreateMode(false));
  }

  const content = users.map((element) => {
    return (
      <tr key={element.id}>
        <td>{element.name}</td>
        <td>{element.role}</td>
        <td>{element.login}</td>
        <td>{formatDate(element.createdAt.toString())}</td>
        <td className="w-60">
          <div className="btn-panel" style={{ display: 'flex', gap: '5px' }}>
            <button className="btn btn-sm btn-outline-danger" onClick={deleteHandler(element.id, element.login)}
              title="Удалить" style={{ padding: '4px 10px', fontSize: '13px' }}>
              <i className="fa fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    )
  })

  return (
    <section>
      <div>
        <h1>Пользователи</h1>
        <div className="table-actions">
          <button className="btn btn-add" onClick={openCreateModal}><i className="fa fa-plus"></i> Добавить</button>
          <div>
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Имя</th>
                  <th>Роль</th>
                  <th>Логин</th>
                  <th>Дата регистрации</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {content}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isCreateMode || !!editUser || isUserEditLoading}
        onCloseHandler={closeModal}
        title={isCreateMode ? 'Новый пользователь' : 'Редактировать пользователя'}
        size="md"
        children={
          isUserEditLoading
            ? <LoaderComponent />
            : <AddUserComponent user={editUser} createMode={isCreateMode} callback={closeModal} />
        }
      />
      <Modal
        isOpen={!!userToDelete}
        onCloseHandler={closeDeleteModal}
        title="Удаление пользователя"
        size="sm"
        children={
          <DeleteControlFormComponent
            message={
              <>
                Удалить пользователя <strong>{userToDelete?.login}</strong>? Вместе с ним удалятся его
                сессии входа, ключи подтверждения почты и корзина. Это действие нельзя отменить.
              </>
            }
            onDeleteHandler={confirmDelete}
            onCancelHandler={closeDeleteModal}
          />
        }
      />
    </section>
  )
}

export default UsersPage;
