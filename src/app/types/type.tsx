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
  userid: string;
  todoid: number;
  name: string;
  icon: number;
  todo: string | null;
  deadline: Date | null;
  checked: Date | null;
};

export type CartItem = {
  id: string;
  name: string;
  buyCount: number;
  price: number;
  count: number;
};

export type Sort = {
  sort:
    | "name"
    | "category"
    | "supplier"
    | "count"
    | "cost"
    | "price"
    | "order"
    | "explanation";
  line: "asc" | "desc";
};

export type buyProductList = {
  id: string;
  userid: string;
  name: string;
  category: number;
  price: number;
  count: number;
  buyDate: Date | null;
}

export type PurchaseHistory = {
  buyGroupId: number;
  productList : buyProductList;
};

export type PurchaseHistoryList = {
  buyGroupId: number;
  productList : buyProductList[];
};
