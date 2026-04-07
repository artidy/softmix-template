import { MouseEvent, ReactElement, useEffect } from 'react';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '../hooks';
import { getIsCreateMode, getIsUserEditLoading, getUser, getUserEdit, getUsers } from '../store/user-data/selectors';
import { deleteUserApi, getApiUsers, getEditUserApi } from '../store/user-data/api-actions';
import { setCreateMode, setUserEdit, setUsers } from '../store/user-data/user-data';
import { formatDate } from '../services/helpers';
import Modal from '../components/modal/modal.component';
import LoaderComponent from '../components/loader/loader.component';
import AddUserComponent from '../components/add-user/add-user.component';

function UsersPage(): ReactElement {
  const dispatch = useAppDispatch();
  const users = useAppSelector(getUsers);
  const user = useAppSelector(getUser);
  const isUserEditLoading = useAppSelector(getIsUserEditLoading);
  const editUser = useAppSelector(getUserEdit);
  const isCreateMode = useAppSelector(getIsCreateMode);

  useEffect(() => {
    dispatch(getApiUsers());

    return () => {
      dispatch(setUsers([]));
    }
  }, []);

  const deleteHandler = (userId: string) => {
    return (evt: MouseEvent) => {
      evt.preventDefault();

      if (user.id === userId) {
        toast.error("Нельзя удалить своего пользователя!");

        return;
      }

      dispatch(deleteUserApi(userId));
    }
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
          <div className="btn-panel">
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
          <button className="btn btn-add" onClick={openCreateModal}>Добавить</button>
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
      <Modal isOpen={isCreateMode || !!editUser || isUserEditLoading} onCloseHandler={closeModal} children={isUserEditLoading ?
        <LoaderComponent /> : <AddUserComponent user={editUser} createMode={isCreateMode} callback={closeModal} />} />
    </section>
  )
}

export default UsersPage;
