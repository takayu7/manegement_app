import { create } from "zustand";
import { CartItem } from "@/app/types/type";

type StoreState = {
  cartItem: CartItem[];
  setStoreCartItem: (item: CartItem[]) => void;
  addStoreCartItem:(item: CartItem) => void;
};


const useStore = create<StoreState>((set) => ({

  cartItem: [] as CartItem[],

  setStoreCartItem: (item: CartItem[]) =>
    set(() => ({
      cartItem: item,
    })),

  addStoreCartItem: (item: CartItem) =>
    set((state) => ({
      cartItem: [...state.cartItem, item],
    })),

}));

export default useStore;
