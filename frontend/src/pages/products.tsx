import {useEffect} from "react";

import {AppRoutes} from "../const";
import BreadCrumbs from "../components/bread-crumbs";
import Filters from "../components/filters";
import {useAppDispatch, useAppSelector} from "../hooks/store";
import {fetchCategoriesAction, fetchProductsAction} from "../store/api-actions";
import {observer} from "../hooks/lozad";
import Category from "../types/category";
import ProductCard from "../components/product-card";

const BREAD_CRUMBS = [
  {
    title: 'Товары',
    link: AppRoutes.Products
  }
];

const Products = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const {products, categories} = useAppSelector(({PRODUCTS}) => PRODUCTS);

  useEffect(() => {
    dispatch(fetchCategoriesAction());
    dispatch(fetchProductsAction())
  }, [dispatch]);

  const getCategoryContent = (category: Category) => {
    return category.children.length === 0 ?
      (<li key={category.id}>
          <a href="#!" className="hover-link" data-title={category.title}><span>{category.title}</span></a>
      </li>) :
      (<li key={category.id} className="sidebar-cat-item sidebar-cat-item-has-child open">
        <a href="#!" className="sidebar-cat-link hover-link" data-title={category.title}>
          <span>{category.title}</span>
          <i className="material-icons md-22 sidebar-cat-icon">chevron_right</i>
        </a>
        <ul style={{display: "block"}}>
          {createCategoriesContent(category.children)}
        </ul>
      </li>)
  };

  const createCategoriesContent = (categories: Category[]) => {
    return categories.map((category) => getCategoryContent(category));
  }

  const contentProducts = products.map((product) =>
    <ProductCard {...product} />)

  observer.observe();

  return (
    <>
      <BreadCrumbs elements={BREAD_CRUMBS} />
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-heading heading-center">
                <div className="section-subheading">Онлайн витрина</div>
                <h1>Товары</h1>
              </div>
            </div>
          </div>
          <Filters />
          <div className="row gutters-20">
            <div className="col-lg-3 col-12">
              <aside className="sidebar sidebar-filters sidebar-filters-mob items">
                <div className="sidebar-item sidebar-item-style item">
                  <p className="sidebar-item-heading item-heading">Категории</p>
                  <ul className="sidebar-cat hl-list sidebar-cat-tree">
                    {createCategoriesContent(categories)}
                  </ul>
                </div>
              </aside>
            </div>
            <div className="col-lg-9 col-12">
              <div className="row gutters-20 catalog">
                {contentProducts}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Products;
