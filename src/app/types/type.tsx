//型定義一覧


export type User = {
  id: string;
  name: string;
  password: string;
  icon: number;
};

export type Category = {
  id: number;
  name: string;
};

export type Supplier = {
  id: number;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  category: number;
  supplier: number;
  count: number;
  cost: number;
  price: number;
  explanation: string;
};


