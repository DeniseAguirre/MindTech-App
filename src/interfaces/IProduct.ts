export interface Product {
  _id: string;
  name: string;
  description: string;
  images: string[];
  category: Category;
  brand: Brand;
  price: number;
  quantity: number;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Brand {
  _id: string;
  name: string;
}
