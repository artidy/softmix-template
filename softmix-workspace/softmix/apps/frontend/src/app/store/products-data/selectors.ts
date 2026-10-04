import { NameSpace } from '../../const';
import { State } from '../../types/state';

export const getImages = (state: State) => state[NameSpace.Products].images;
