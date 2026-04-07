export interface Category {
  id?: string;
  title: string;
  owner: Category;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryApi {
  id: string;
  title: string;
  ownerId: string | null;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryCreate {
  title: string;
  ownerId?: string;
  position?: number;
}

export interface CategoryUpdate {
  id?: string;
  title?: string;
  ownerId?: string;
  position?: number;
}
