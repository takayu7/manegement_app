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

export type SortType = | "name"
    | "category"
    | "supplier"
    | "count"
    | "cost"
    | "price"
    | "order"

export type LineType = "asc" | "desc";

export type Sort = {
  sort: SortType;
  line: LineType;
};

export type BuyProductList = {
  id: string;
  userid: string;
  name: string;
  price: number;
  count: number;
  buyDate: Date | null;
}

export type PurchaseHistory = {
  buyGroupId: number;
  productList : BuyProductList;
};

export type PurchaseHistoryList = {
  buyGroupId: number;
  productList : BuyProductList[];
};

export type UserBuyParameterType = {
  id: number;
  userid: string;
  name: string;
  icon: number;
  price: number;
  count: number;
};
