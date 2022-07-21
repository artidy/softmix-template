import CategoryItem from "./category-item";

const Categories = (): JSX.Element => {
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
            products={[
              {
                title: "Iphone",
                dataTitle: "Iphone",
                href: "!#"
              },
              {
                title: "Samsung",
                dataTitle: "Samsung",
                href: "!#"
              },
              {
                title: "Google Pixel",
                dataTitle: "Google Pixel",
                href: "!#"
              },
              {
                title: "OnePlus",
                dataTitle: "OnePlus",
                href: "!#"
              },
            ]}
          />
          <CategoryItem
            dataSrc="assets/img/shop/cat/c1.jpg"
            src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            alt=""
            title="Computers"
            btnHref="#!"
            products={[
              {
                title: "Iphone",
                dataTitle: "Iphone",
                href: "!#"
              },
              {
                title: "Samsung",
                dataTitle: "Samsung",
                href: "!#"
              },
              {
                title: "Google Pixel",
                dataTitle: "Google Pixel",
                href: "!#"
              },
              {
                title: "OnePlus",
                dataTitle: "OnePlus",
                href: "!#"
              },
            ]}
          />
          <CategoryItem
            dataSrc="assets/img/shop/cat/c1.jpg"
            src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            alt=""
            title="Home"
            btnHref="#!"
            products={[
              {
                title: "Iphone",
                dataTitle: "Iphone",
                href: "!#"
              },
              {
                title: "Samsung",
                dataTitle: "Samsung",
                href: "!#"
              },
              {
                title: "Google Pixel",
                dataTitle: "Google Pixel",
                href: "!#"
              },
              {
                title: "OnePlus",
                dataTitle: "OnePlus",
                href: "!#"
              },
            ]}
          />
          <CategoryItem
            dataSrc="assets/img/shop/cat/c1.jpg"
            src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            alt=""
            title="Kitchen"
            btnHref="#!"
            products={[
              {
                title: "Iphone",
                dataTitle: "Iphone",
                href: "!#"
              },
              {
                title: "Samsung",
                dataTitle: "Samsung",
                href: "!#"
              },
              {
                title: "Google Pixel",
                dataTitle: "Google Pixel",
                href: "!#"
              },
              {
                title: "OnePlus",
                dataTitle: "OnePlus",
                href: "!#"
              },
            ]}
          />
          <CategoryItem
            dataSrc="assets/img/shop/cat/c1.jpg"
            src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            alt=""
            title="Washing mashines"
            btnHref="#!"
            products={[
              {
                title: "Iphone",
                dataTitle: "Iphone",
                href: "!#"
              },
              {
                title: "Samsung",
                dataTitle: "Samsung",
                href: "!#"
              },
              {
                title: "Google Pixel",
                dataTitle: "Google Pixel",
                href: "!#"
              },
              {
                title: "OnePlus",
                dataTitle: "OnePlus",
                href: "!#"
              },
            ]}
          />
          <CategoryItem
            dataSrc="assets/img/shop/cat/c1.jpg"
            src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            alt=""
            title="Home & Cleaning"
            btnHref="#!"
            products={[
              {
                title: "Iphone",
                dataTitle: "Iphone",
                href: "!#"
              },
              {
                title: "Samsung",
                dataTitle: "Samsung",
                href: "!#"
              },
              {
                title: "Google Pixel",
                dataTitle: "Google Pixel",
                href: "!#"
              },
              {
                title: "OnePlus",
                dataTitle: "OnePlus",
                href: "!#"
              },
            ]}
          />
        </div>
      </div>
    </section>
  )
}

export default Categories;
