import { NameSpace } from '../../const';
import { State } from '../../types/state';

export const getCategories = (state: State) => state[NameSpace.Categories].categories;
export const getIsCategoriesLoading = (state: State) => state[NameSpace.Categories].isLoading;
