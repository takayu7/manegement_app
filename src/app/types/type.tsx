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
  order: number;
  cost: number;
  price: number;
  explanation: string;
};

export type Todo = {
  id: string;
  todoid: number;
  name: string;
  icon: number;
  todo: string | null;
  deadline: Date | null;
  checked: Date | null;
};