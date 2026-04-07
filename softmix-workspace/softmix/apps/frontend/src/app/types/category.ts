export interface Category {
  id: string;
  title: string;
  ownerId: string;
  position: number;
  categories: Category[];
  createdAt?: Date;
  updatedAt?: Date;
}
