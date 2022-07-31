import {createSlice} from "@reduxjs/toolkit";

import {NameSpace} from "../../const";
import {Product} from "../../types/product";
import Category from "../../types/category";

const INITIAL_PRODUCTS: Product[] = [];
const INITIAL_CATEGORIES: Category[] = [];

const initialState = {
  products: INITIAL_PRODUCTS,
  categories: INITIAL_CATEGORIES,
  productsLoaded: false,
  categoriesLoaded: false
}

const productsSlice = createSlice({
    name: NameSpace.Products,
    initialState,
    reducers:
      {
        fetchProducts: (state, action) => {
          state.products = action.payload;
          state.productsLoaded = true;
        },
        fetchCategories: (state, action) => {
          state.categories = action.payload;
          state.categoriesLoaded = true;
        }
      }
  }
);

const {fetchProducts, fetchCategories} = productsSlice.actions;

export {productsSlice, fetchProducts, fetchCategories};
