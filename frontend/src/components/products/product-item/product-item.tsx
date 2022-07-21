type ProductItemProps = {
  title: string;
  href: string;
  dataTitle: string;
}

const ProductItem = ({title, href, dataTitle}: ProductItemProps): JSX.Element => {
  return (
    <li><a href={href} className="hover-link" data-title={dataTitle}><span>{title}</span></a></li>
  )
}

export default ProductItem;
