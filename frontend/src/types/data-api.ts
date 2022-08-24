import {AST} from 'eslint';
import Token = AST.Token;

type DataApi<T> = {
  data: T;
  newTokens: {
    token: Token;
    refreshToken: Token;
  }
}

export type {DataApi};
