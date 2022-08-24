import Token from '../types/token';
import {TokenType} from '../const';
import {UserLogin} from '../types/user';

const getToken = (tokenType: TokenType): Token => {
  const token = localStorage.getItem(tokenType);
  return token ?? '';
};

const saveToken = (token: Token, tokenType: TokenType): void => {
  localStorage.setItem(tokenType, token);
};

const saveTokens = (data: UserLogin): void => {
  if (data.token && data.refreshToken) {
    saveToken(data.token, TokenType.Token);
    saveToken(data.refreshToken, TokenType.RefreshToken);
  }
}

const dropToken = (tokenType: TokenType): void => {
  localStorage.removeItem(tokenType);
};

const dropTokens = (): void => {
  dropToken(TokenType.Token);
  dropToken(TokenType.RefreshToken);
};

export {getToken, saveToken, saveTokens, dropToken, dropTokens};
