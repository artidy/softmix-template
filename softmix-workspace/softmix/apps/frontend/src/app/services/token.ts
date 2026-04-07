import { EXPIRES_IN, REFRESH_TOKEN, TOKEN } from '../const';

export const getToken = (tokenType: string) => {
  const token = localStorage.getItem(tokenType);

  return token ?? '';
};

export const getExpiresIn = () => {
  return +localStorage.getItem(EXPIRES_IN) ?? null;
};

export const getActiveToken = () => {
  let token = localStorage.getItem(TOKEN);

  if (!token) {
    token = localStorage.getItem(REFRESH_TOKEN);
    dropToken(REFRESH_TOKEN);
    dropToken(EXPIRES_IN);
  }

  return token;
};

export const saveTokens = (accessToken: string, refreshToken: string, expiresIn: string) => {
  localStorage.setItem(TOKEN, accessToken);
  localStorage.setItem(REFRESH_TOKEN, refreshToken);
  localStorage.setItem(EXPIRES_IN, expiresIn);
};

export const dropToken = (tokenType: string) => {
  localStorage.removeItem(tokenType);
};

export const dropTokens = () => {
  dropToken(TOKEN);
  dropToken(REFRESH_TOKEN);
  dropToken(EXPIRES_IN);
};
