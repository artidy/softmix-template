type Category = {
  id: string;
  title: string;
  parentId: string;
  preview: string;
  children: Category[];
}

export default Category;
