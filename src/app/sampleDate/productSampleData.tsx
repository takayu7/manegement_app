import { Product , Supplier } from "@/app/types/type";

export const sampleData: Product[] = [
    {
      name: "ORCIVAL",
      category: 1,
      supplier: Supplier.shopA,
      count: 10,
      cost: 1000,
      price: 1500,
    },
        {
      name: "ORCIVAL",
      category: 2,
      supplier: Supplier.shopB,
      count: 10,
      cost: 1000,
      price: 1500,
    },
  ];