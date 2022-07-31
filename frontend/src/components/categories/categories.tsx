import CategoryItem from "./category-item";
import {useAppDispatch, useAppSelector} from "../../hooks/store";
import {useEffect} from "react";
import {fetchCategoriesAction, fetchProductsAction} from "../../store/api-actions";

const Categories = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const {products, categories} = useAppSelector(({PRODUCTS}) => PRODUCTS);

  useEffect(() => {
    dispatch(fetchCategoriesAction());
    dispatch(fetchProductsAction())
  }, [dispatch]);

  return (
    <section className="section section-bgc">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-heading heading-center">
              <div className="section-subheading">Популярное</div>
              <h2>Категории</h2>
            </div>
          </div>
        </div>
        <div className="row items">
          <CategoryItem
            dataSrc="assets/img/shop/cat/c1.jpg"
            src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            alt=""
            title="Mobile & Tablets"
            btnHref="#!"
            products={products}
          />
          <CategoryItem
            dataSrc="assets/img/shop/cat/c1.jpg"
            src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            alt=""
            title="Computers"
            btnHref="#!"
            products={products}
          />
          <CategoryItem
            dataSrc="assets/img/shop/cat/c1.jpg"
            src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            alt=""
            title="Home"
            btnHref="#!"
            products={products}
          />
          <CategoryItem
            dataSrc="assets/img/shop/cat/c1.jpg"
            src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            alt=""
            title="Kitchen"
            btnHref="#!"
            products={products}
          />
          <CategoryItem
            dataSrc="assets/img/shop/cat/c1.jpg"
            src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            alt=""
            title="Washing mashines"
            btnHref="#!"
            products={products}
          />
          <CategoryItem
            dataSrc="assets/img/shop/cat/c1.jpg"
            src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            alt=""
            title="Home & Cleaning"
            btnHref="#!"
            products={products}
          />
        </div>
      </div>
    </section>
  )
}

export default Categories;
