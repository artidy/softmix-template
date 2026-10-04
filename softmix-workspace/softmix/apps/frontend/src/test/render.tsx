import { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RootState, setupStore } from '../app/store';
import { AuthorizationStatus, User, UserRole } from '../app/types/user';

/** Показывает текущий адрес — по нему тест проверяет переходы и перенаправления. */
function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{`${location.pathname}${location.search}`}</output>;
}

type Options = {
  /** Адрес, с которого начинается тест; объект — если нужно передать state. */
  route?: string | { pathname: string; search?: string; state?: unknown };
  /** Шаблон маршрута для страницы, если ей нужны параметры (например, '/shop/:id'). */
  path?: string;
  preloadedState?: Partial<RootState>;
};

export function renderWithProviders(ui: ReactElement, { route = '/', path, preloadedState }: Options = {}) {
  const store = setupStore(preloadedState);
  const user = userEvent.setup();

  const result = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route
            path={path ?? '*'}
            element={
              <>
                {ui}
                <LocationProbe />
              </>
            }
          />
          {path && <Route path="*" element={<LocationProbe />} />}
        </Routes>
      </MemoryRouter>
    </Provider>,
  );

  return { store, user, ...result };
}

export function makeUser(role: UserRole = UserRole.User, patch: Partial<User> = {}): User {
  return {
    id: `user-${role}`,
    name: 'Тестовый Пользователь',
    login: `test-${role}`,
    email: `${role}@example.com`,
    role,
    // С сервера дата приходит строкой — так и храним, иначе Redux ругается на несериализуемое значение.
    createdAt: '2025-01-15T10:00:00Z' as unknown as Date,
    ...patch,
  };
}

/** Состояние «пользователь вошёл» для preloadedState. */
export function authState(user: User): Partial<RootState> {
  return {
    USERS: {
      authorizationStatus: AuthorizationStatus.Auth,
      user,
      users: [],
      userEdit: null,
      isLoading: false,
      isEditLoading: false,
      isCreateMode: false,
    },
  } as Partial<RootState>;
}

export const guestState = {
  USERS: {
    authorizationStatus: AuthorizationStatus.NoAuth,
    user: null,
    users: [],
    userEdit: null,
    isLoading: false,
    isEditLoading: false,
    isCreateMode: false,
  },
} as Partial<RootState>;
