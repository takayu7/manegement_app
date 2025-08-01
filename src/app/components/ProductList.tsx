"use client";
import React, { startTransition, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import {
  Sofa,
  ShoppingCart,
  CircleX,
  Plus,
  Minus,
  ScrollText,
} from "lucide-react";
import { Product, CartItem, BuyProductList } from "@/app/types/type";
import { CartDialog } from "@/app/components/CartDialog";
import OrderHistoryDialog from "@/app/components/OrderHistoryDialog";
import { Player } from "@lottiefiles/react-lottie-player";

export interface ProductListProps {
  productDataList: Product[];
  onSave: (cart: CartItem[], product: BuyProductList[]) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  productDataList,
  onSave,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productDatas, setProductDatas] = useState<Product[]>(productDataList);
  const [buyProductId, setBuyProductId] = useState<{ [id: string]: number }>(
    {}
  );
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [showThanks, setShowThanks] = useState(false);

  // const [orderHistoryList, setOrderHistoryList] = useState<BuyProductList[]>(
  //   []
  // );

  const buyProduct = selectedProduct
    ? buyProductId[selectedProduct.id] || 0
    : 0;

  const CategoryImages: Record<string, string> = {
    "1": "/product/image2.jpg",
    "2": "/product/image6.jpg",
    "3": "/product/image4.jpg",
    "4": "/product/image3.jpg",
    "5": "/product/image7.jpg",
    "6": "/product/image8.jpg",
    "7": "/product/image1.jpg",
  };

  // 商品をカートに追加ボタン
  const handleAdd = () => {
    if (!selectedProduct || buyProduct <= 0) return;

    //重複アイテム
    const existingItem = cartItems.findIndex(
      (item) => selectedProduct.id === item.id
    );

    if (existingItem >= 0) {
      const updateCartItems = [...cartItems];
      updateCartItems[existingItem] = {
        ...updateCartItems[existingItem],
        buyCount: updateCartItems[existingItem].buyCount + buyProduct,
      };
      setCartItems(updateCartItems);
    } else {
      const newItem: CartItem = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        buyCount: buyProduct,
        price: selectedProduct.price,
        count: selectedProduct.count,
      };
      setCartItems((prev) => {
        return [...prev, newItem];
      });
    }

    //初期化
    setBuyProductId((prev) => ({
      ...prev,
      [selectedProduct.id]: 0,
    }));

    //カードを閉じる
    setSelectedProduct(null);

    toast.error("Added to cart", {
      position: "bottom-right",
      autoClose: 4000,
      theme: "colored",
    });
  };

  // カート商品の購入ボタン
  const handleBuy = (cart: CartItem[], product: BuyProductList[]) => {
    startTransition(() => {
      console.log(product);
      onSave(cart, product);
    });
    setShowThanks(true);
    setTimeout(() => setShowThanks(false), 4000);
    setCartItems([]);
    setIsCartOpen(false);
  };

  //削除ボタン
  const handleDelete = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = (buyProductList: BuyProductList[]) => {
    console.log(buyProductList);
    setIsOrderHistoryOpen(false);
  };

  useEffect(() => {
    setProductDatas(productDataList);
  }, [productDataList]);

  return (
    <>
      {showThanks && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Player
            autoplay
            loop={false}
            src="/lottie/Thanks.json"
            style={{ height: "100vh", width: "100vw" }}
          />
        </div>
      )}

      <main className="">
        <h1 className="mb-10 text-xl md:text-4xl font-bold ">
          <Sofa className="inline-block mr-2.5 size-10" />
          Product list
        </h1>

        <div className="grid gap-4  lg:gap-6 lg:grid-cols-3 ">
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
                    className="btn bg-white btn-dash btn-wide mt-1.5 text-blue-800 hover:bg-blue-900 hover:text-white "
                    onClick={() => setSelectedProduct(product)}
                  >
                    details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* カートボタン */}
        <div className="indicator fixed top-49 right-12 lg:top-35 lg:right-30">
          {cartItems.length > 0 && (
            <span className="indicator-item badge badge-primary bg-blue-900 rounded-full ">
              {cartItems.length}
            </span>
          )}
          <button
            onClick={() => setIsCartOpen(true)}
            className="btn btn-lg lg:btn-xl btn-error text-white btn-circle"
          >
            <ShoppingCart />
          </button>
        </div>

        {/* 購入履歴ボタン */}
        <div className="indicator fixed top-67 right-12 lg:top-53 lg:right-30">
          <button
            onClick={() => setIsOrderHistoryOpen(true)}
            className="btn btn-lg lg:btn-xl btn-error text-white btn-circle"
          >
            <ScrollText />
          </button>
        </div>
      </main>
      {/* カード */}
      {selectedProduct && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center"
            onClick={() => setSelectedProduct(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white w-[100%] lg:w-[700px] p-6 lg:p-8 flex flex-col lg:flex-row rounded-2xl relative">
              <div className="flex-shrink-0 inline-block mr-5">
                <Image
                  src={CategoryImages[selectedProduct.category]}
                  alt={selectedProduct.name}
                  width={250}
                  height={100}
                  className="rounded-xl "
                />
              </div>

              <div className="flex flex-col ">
                <div className="mb-5">
                  <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                  <p className="mt-4 text-sm">{selectedProduct.explanation}</p>
                </div>
                <div className="mb-5">
                  <p className="mt-2">price：{selectedProduct.price}</p>
                  <p className="mt-2">
                    stock：
                    {selectedProduct.count > 0 ? (
                      selectedProduct.count
                    ) : (
                      <span className="text-red-600">sold out</span>
                    )}
                  </p>
                </div>
                <div className="flex items-end">
                  <label className="mt-2">buy :</label>
                  <label>{buyProduct}</label>
                  <div className="flex items-center gap-4 ml-6">
                    <button
                      className="btn btn-outline btn-error"
                      onClick={() => {
                        setBuyProductId((prev) => ({
                          ...prev,
                          [selectedProduct.id]: buyProduct - 1,
                        }));
                      }}
                      disabled={buyProduct <= 0}
                    >
                      <Minus />
                    </button>
                    <button
                      className="btn btn-outline btn-success"
                      onClick={() => {
                        setBuyProductId((prev) => ({
                          ...prev,
                          [selectedProduct.id]: buyProduct + 1,
                        }));
                      }}
                      disabled={
                        selectedProduct.count <= 0 ||
                        selectedProduct.count <= buyProduct
                      }
                    >
                      <Plus />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="btn btn-outline btn-secondary btn-lg absolute bottom-7 right-10 hover:text-white"
                  onClick={handleAdd}
                  disabled={buyProduct < 1}
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
          product={productDataList}
          cartItems={cartItems}
          onClose={() => setIsCartOpen(false)}
          onSave={handleBuy}
          onDelete={handleDelete}
        />
      )}

      {isOrderHistoryOpen && (
        <OrderHistoryDialog
          onSave={handleSave}
          onClose={() => setIsOrderHistoryOpen(false)}
        />
      )}
    </>
  );
};

export default ProductList;
