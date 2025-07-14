//型定義一覧

export type User = {
  id: string;
  name: string;
  password: string;
};

export enum Supplier {
  shopA = "shopA", // 故障履歴
  shopB = "shopB",
  shopC = "shopC",
}

export type Product = {
  name: string;
  category: number;
  supplier: Supplier;
  count: number;
  cost: number;
  price: number;
};


