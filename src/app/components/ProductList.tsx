"use client";
import Image from "next/image";
import React, { useEffect, useState, useTransition } from "react";
import { toast } from "react-toastify";
// import { jpMoneyChange } from "@/app/lib/utils";
import { Product } from "@/app/types/type";
import { Sofa, ShoppingCart, CircleX, Plus, Minus } from "lucide-react";
import { CartDialog } from "@/app/components/CartDialog";

export interface ProductListProps {
  productDataList: Product[];
  onDelete: (productId: string) => void;
  onSave: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  productDataList,
  onSave,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productDatas, setProductDatas] = useState<Product[]>(productDataList);
  const [buyProduct, setBuyProduct] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const CategoryImages: Record<string, string> = {
    "1": "/product/image2.jpg",
    "2": "/product/image6.jpg",
    "3": "/product/image4.jpg",
    "4": "/product/image3.jpg",
    "5": "/product/image7.jpg",
    "6": "/product/image8.jpg",
    "7": "/product/image1.jpg",
  };

  type CartItem = {
    id: string;
    name: string;
    count: number;
    price: number;
  };

  const handleBuy = () => {
    //0以下の場合返す
    if (!selectedProduct || buyProduct <= 0) return;

    //カート商品
    const newItem: CartItem = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      count: buyProduct,
      price: selectedProduct.price,
    };

    //追加
    setCartItems([...cartItems, newItem]);

    // 在庫を更新
    const updatedProduct = {
      ...selectedProduct,
      count: selectedProduct.count - buyProduct,
    };

    setProductDatas((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );

    onSave(updatedProduct);

    setSelectedProduct(null);
    setBuyProduct(0);

    //トースト表示
    toast.success("Thank you for your purchase!!", {
      position: "bottom-right",
      autoClose: 4000, //4秒
      theme: "colored",
    });

    // カードを閉じる
    setSelectedProduct(null);
  };

  useEffect(() => {
    setProductDatas(productDataList);
  }, [productDataList]);

  return (
    <>
      <main>
        <h1 className="mb-10 text-xl md:text-4xl font-bold">
          <Sofa className="inline-block mr-2.5 size-10" />
          Product list
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          {productDatas.map((product) => (
            <div
              key={product.id}
              className="card-body flex flex-col justify-between rounded-xl bg-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 h-full"
            >
              <figure className="flex justify-center items-center h-[200px]">
                <Image
                  src={CategoryImages[product.category]}
                  alt={product.name}
                  width={220}
                  height={100}
                  className="rounded-xl"
                />
              </figure>
              <div className="p-0">
                <h2 className="card-title text-xl flex justify-center mt-1 text-gray-600">
                  {product.name}
                </h2>
                <div className="card-actions justify-center">
                  <button
                    className="btn btn-success btn-dash btn-wide mt-1.5 "
                    onClick={() => setSelectedProduct(product)}
                  >
                    details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="indicator fixed top-35 right-30">
          <span className="indicator-item badge badge-primary">
            {buyProduct}
          </span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="btn btn-lg btn-accent"
          >
            <ShoppingCart />
          </button>
        </div>
      </main>
      {/* カード */}
      {selectedProduct && (
        <>
          <div
            className="fixed inset-0 bg-gray-200/80 bg-opacity-50 z-40"
            onClick={() => setSelectedProduct(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white w-200 p-10 flex flex-row rounded-2xl relative">
              <div className="flex-shrink-0 inline-block mr-5">
                <Image
                  src={CategoryImages[selectedProduct.category]}
                  alt={selectedProduct.name}
                  width={250}
                  height={100}
                  className="rounded-xl"
                />
              </div>

              <div className="flex flex-col">
                <div className="mb-5">
                  <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                  <p className="mt-4 text-sm">{selectedProduct.explanation}</p>
                </div>
                <div className="mb-5">
                  <p className="mt-2">price：{selectedProduct.price}</p>
                  <p className="mt-2">stock：{selectedProduct.count}</p>
                </div>
                <div className="flex items-end">
                  <label className="mt-2">buy :</label>
                  <label>{buyProduct}</label>
                  <div className="flex items-center gap-4 ml-6">
                    <button
                      className="btn btn-outline btn-success"
                      onClick={() => setBuyProduct(buyProduct + 1)}
                    >
                      <Plus />
                    </button>
                    <button
                      className="btn btn-outline btn-error"
                      onClick={() => setBuyProduct(buyProduct - 1)}
                    >
                      <Minus />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="btn btn-outline btn-success btn-lg absolute bottom-7 right-10 hover:"
                  onClick={() => {
                    onSave(selectedProduct);
                    handleBuy();
                  }}
                >
                  <ShoppingCart className="mr-0.5" />
                  cart
                </button>
              </div>
              <div className="">
                <button
                  className="absolute top-4 right-4 btn btn-ghost btn-circle"
                  onClick={() => setSelectedProduct(null)}
                >
                  <CircleX className="mr-0.5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {isCartOpen && (
        <CartDialog
          cartItems={cartItems}
          onClose={() => setIsCartOpen(false)}
          onDelete={() => setIsCartOpen(false)}
        />
      )}
    </>
  );
};

export default ProductList;
