import ProductItem from "./product-item";
import {Product} from "../../types/product";

type ProductsProps = {
  products: Product[];
}

const Products = ({products}: ProductsProps): JSX.Element => {
  const productsContent = products.map((product) =>
    <ProductItem title={product.title} href={product.href} dataTitle={product.dataTitle} />)

  return (
    <ul className="list-style-none catt-item-links">
      {productsContent}
    </ul>
  )
}

export default  Products;
