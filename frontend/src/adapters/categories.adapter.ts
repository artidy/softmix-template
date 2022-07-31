import CategoryApi from "../types/category-api";
import Category from "../types/category";

const adaptCategory = (category: CategoryApi, categories: CategoryApi[]): Category => {
  return {...category, children: adaptCategories(categories, category.id)};
}

const adaptCategories = (categories: CategoryApi[], parentId = ""): Category[] => {
  const mainCategories = categories.filter((category) => category.parentId === parentId);

  return mainCategories.map((category) => adaptCategory(category, categories));
}

export {adaptCategory, adaptCategories};
