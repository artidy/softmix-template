import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2, UserRound } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../hooks';
import { USER_ROLES } from '../const';
import { getInitials } from '../lib/format';
import { useDocumentTitle } from '../lib/use-document-title';
import {
  getIsCreateMode,
  getIsUserEditLoading,
  getIsUsersLoading,
  getUser,
  getUserEdit,
  getUsers,
} from '../store/user-data/selectors';
import { deleteUserApi, getApiUsers, getEditUserApi } from '../store/user-data/api-actions';
import { setCreateMode, setUserEdit, setUsers } from '../store/user-data/user-data';
import { User, UserRole } from '../types/user';
import { formatDate } from '../utils/format';
import { AdminPageHeader } from '../components/admin/admin-page-header';
import { UserForm } from '../components/admin/user-form';
import { Badge, BadgeVariant } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { Dialog, DialogContent } from '../ui/dialog';
import { PageLoader, Skeleton } from '../ui/feedback';

const ROLE_BADGE: Record<string, BadgeVariant> = {
  [UserRole.Admin]: 'highlight',
  [UserRole.Manager]: 'primary',
  [UserRole.User]: 'neutral',
};

function roleTitle(role: string): string {
  return USER_ROLES.find((item) => String(item.role) === role)?.title ?? role;
}

function UsersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(getUsers);
  const currentUser = useAppSelector(getUser);
  const isUsersLoading = useAppSelector(getIsUsersLoading);
  const isUserEditLoading = useAppSelector(getIsUserEditLoading);
  const editUser = useAppSelector(getUserEdit);
  const isCreateMode = useAppSelector(getIsCreateMode);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useDocumentTitle('Пользователи — панель управления');

  useEffect(() => {
    dispatch(getApiUsers());

    return () => {
      dispatch(setUsers([]));
    };
  }, [dispatch]);

  const askDelete = (user: User) => {
    if (currentUser?.id === user.id) {
      toast.error('Нельзя удалить своего пользователя!');
      return;
    }
    setUserToDelete(user);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      dispatch(deleteUserApi(userToDelete.id));
    }
    setUserToDelete(null);
  };

  const closeModal = () => {
    dispatch(setUserEdit(null));
    dispatch(setCreateMode(false));
  };

  const isFormOpen = isCreateMode || Boolean(editUser) || isUserEditLoading;

  return (
    <>
      <AdminPageHeader
        title="Пользователи"
        description={users.length > 0 ? `Всего: ${users.length}` : undefined}
        actions={
          <Button onClick={() => dispatch(setCreateMode(true))}>
            <Plus />
            Добавить
          </Button>
        }
      />

      <Card className="overflow-hidden">
        {isUsersLoading && users.length === 0 ? (
          <div className="divide-y">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="flex items-center gap-4 p-4">
                <Skeleton className="size-9 rounded-full" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] text-sm">
              <thead className="border-b bg-muted/50 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Пользователь</th>
                  <th className="px-4 py-3 font-semibold">Логин</th>
                  <th className="px-4 py-3 font-semibold">Роль</th>
                  <th className="px-4 py-3 font-semibold">Дата регистрации</th>
                  <th className="px-4 py-3">
                    <span className="sr-only">Действия</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-accent/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                          {getInitials(user.name || user.login) || <UserRound className="size-4" />}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{user.name}</p>
                          {user.email && <p className="truncate text-xs text-muted-foreground">{user.email}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{user.login}</td>
                    <td className="px-4 py-3">
                      <Badge variant={ROLE_BADGE[user.role] ?? 'neutral'}>{roleTitle(String(user.role))}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => dispatch(getEditUserApi(user.id))}
                          aria-label={`Редактировать ${user.login}`}
                          title="Редактировать"
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => askDelete(user)}
                          aria-label={`Удалить ${user.login}`}
                          title="Удалить"
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Dialog open={isFormOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent title={isCreateMode ? 'Новый пользователь' : 'Редактировать пользователя'} size="lg">
          {isUserEditLoading ? (
            <PageLoader />
          ) : (
            <UserForm key={editUser?.id ?? 'new'} user={isCreateMode ? null : editUser} onCancel={closeModal} />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(userToDelete)}
        onOpenChange={(open) => !open && setUserToDelete(null)}
        title="Удалить пользователя?"
        description={
          <>
            Удалить пользователя <span className="font-medium text-foreground">{userToDelete?.login}</span>? Вместе с ним
            удалятся его сессии входа, ключи подтверждения почты и корзина. Это действие нельзя отменить.
          </>
        }
        onConfirm={confirmDelete}
      />
    </>
  );
}

export default UsersPage;
