"use client";
import React, { startTransition, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { Sofa, ShoppingCart, ScrollText, Heart } from "lucide-react";
import {
  Product,
  CartItem,
  BuyProductList,
  userItemsType,
} from "@/app/types/type";
import { CartDialog } from "@/app/components/product/CartDialog";
import OrderHistoryDialog from "@/app/components/product/OrderHistoryDialog";
import { ReviewDialog } from "@/app/components/product/ReviewDialog";
import DetailDialog from "@/app/components/product/DetailDialog";
import { Player } from "@lottiefiles/react-lottie-player";
import useStore from "@/app/store/useStore";
import { CategoryImages } from "@/app/lib/utils";
import { useSessionStorage } from "@/app/hooks/useSessionStorage";

type SetProductDatas = React.Dispatch<React.SetStateAction<Product[]>>;
type SetFavoriteDatas = React.Dispatch<React.SetStateAction<userItemsType[]>>;

export const onSave = async (
  cart: CartItem[],
  product: BuyProductList[],
  setProductDatas: SetProductDatas
) => {
  // 購入履歴の登録
  await fetch("/api/userBuyHistory", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
    cache: "no-store",
  });

  // 商品情報の更新
  const resProducts = await fetch("/api/userBuyHistory", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cart),
    cache: "no-store",
  });
  const responseText = await resProducts.text();
  console.log("Response text:", responseText);
  // 商品一覧を再取得してstateを更新
  const updated = await fetch("/api/products");
  const updatedData = await updated.json();
  setProductDatas(updatedData);
};

export const onFavorite = async (
  productId: string,
  userId: string,
  isFavorite: boolean,
  setFavoriteList: SetFavoriteDatas
) => {
  // 購入履歴の登録
  await fetch(`/api/favorite/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId, userId, isFavorite }),
    cache: "no-store",
  });

  // 商品一覧を再取得してstateを更新
  const updated = await fetch(`/api/favorite/${userId}`);
  const updatedData = await updated.json();
  setFavoriteList(updatedData);
};

export const ProductList = (product: Product) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productDatas, setProductDatas] = useState<Product[]>([]);
  const [buyProductId, setBuyProductId] = useState<{ [id: string]: number }>(
    {}
  );
  const [favorite, setFavorite] = useState<userItemsType[]>([]);
  const [favoriteList, setFavoriteList] = useState(false);
  //ダイアログ
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  //アニメーション
  const [showThanks, setShowThanks] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  // ローディング状態
  const [loading, setLoading] = useState(true);

  const setStoreCartItem = useStore((state) => state.setStoreCartItem);
  const addStoreCartItem = useStore((state) => state.addStoreCartItem);
  const cartItems = useStore((state) => state.cartItem);

  const userId = useSessionStorage("staffId", "0");
  console.log(product);

  // 商品データの取得
  async function ferchProductData() {
    setLoading(true);
    const data = await fetch(`/api/products`);
    const productData = await data.json();

    setProductDatas(productData);
    setLoading(false);
  }

  //DBからfavoriteデータの取得
  useEffect(() => {
    if (userId === "0") return;
    setLoading(true);
    fetch(`/api/favorite/${userId}`)
      .then((res) => res.json())
      .then((data) => setFavorite(data))
      .finally(() => setLoading(false));
  }, [userId]);

  const buyProduct = selectedProduct
    ? buyProductId[selectedProduct.id] || 0
    : 0;

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
      setStoreCartItem(updateCartItems);
    } else {
      const newItem: CartItem = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        buyCount: buyProduct,
        price: selectedProduct.price,
        count: selectedProduct.count,
      };
      addStoreCartItem(newItem);
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

  // buyボタン(購入)(CartDialog内)
  const handleBuy = (cart: CartItem[], product: BuyProductList[]) => {
    startTransition(() => {
      console.log(product);
      onSave(cart, product, setProductDatas);
    });
    setShowThanks(true);
    setTimeout(() => setShowThanks(false), 4000);
    setStoreCartItem([]);
    setIsCartOpen(false);
  };

  //deleteボタン(削除)(CartDialog内)
  const handleDelete = (id: string) => {
    setStoreCartItem(cartItems.filter((item) => item.id !== id));
  };

  //購入履歴ボタン
  const handleSave = (buyProductList: BuyProductList[]) => {
    console.log(buyProductList);
    setIsOrderHistoryOpen(false);
  };

  //detailボタン
  const handleDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  //reviewボタン
  const handleReview = (product: Product) => {
    setSelectedProduct(product);
    setIsReviewOpen(true);
  };

  //お気に入りボタン
  const handleFavorite = (productId: string, isFavorite: boolean) => {
    startTransition(() => {
      onFavorite(productId, userId, isFavorite, setFavorite);
    });
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1000);
  };

  //お気に入りのみ表示ボタン
  const handleFavoriteList = () => {
    if (favorite.length > 0) {
      setProductDatas(
        productDatas.filter((i) => favorite.some((f) => f.productId === i.id))
      );
    } else {
      ferchProductData();
    }
    setFavoriteList(true);
  };

  useEffect(() => {
    ferchProductData();
  }, []);

  console.log(favorite);

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
      {showHeart && (
        <div className="">
          <Player
            autoplay
            loop={false}
            src="/lottie/Heart.json"
            
          />
        </div>
      )}

      <main className="h-screen">
        <h1 className="mb-5 text-xl md:text-4xl font-bold ">
          <Sofa className="inline-block mr-2.5 size-10" />
          Product list
        </h1>

        <div className="mb-5">
          {favoriteList ? (
            <button
              className="btn btn-outline btn-secondary  hover:text-white"
              onClick={() => {
                ferchProductData();
                setFavoriteList(false);
              }}
            >
              all
            </button>
          ) : (
            <button
              className="btn btn-outline btn-secondary  hover:text-white"
              onClick={() => handleFavoriteList()}
            >
              favorite
            </button>
          )}
        </div>

        <div className="grid gap-4 lg:gap-6 lg:grid-cols-3 ">
          {/* アニメーション */}
          {loading ? (
            <div className="mx-auto">
              <Player
                autoplay
                loop
                src="/lottie/Loading.json"
                style={{
                  height: "100px",
                  width: "100px",
                }}
              />
            </div>
          ) : (
            productDatas.map((product) => (
              <div
                key={product.id}
                className={
                  product.count > 0
                    ? "card-body flex flex-col justify-between rounded-xl bg-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 min-h-[80%]  p-4"
                    : "card-body flex flex-col justify-between rounded-xl bg-red-100 shadow-sm hover:shadow-xl transition-shadow duration-300 min-h-[80%] p-4"
                }
              >
                <div className="flex flex-row justify-between">
                  <button
                    className={`btn btn-circle btn-ghost ${
                      favorite.some((f) => f.productId === product.id)
                        ? "bg-pink-400 text-white"
                        : "text-gray-600"
                    }  hover:opacity-75 p-1  `}
                    onClick={() =>
                      handleFavorite(
                        product.id,
                        !favorite.some((f) => f.productId === product.id)
                      )
                    }
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  {product.count === 0 && (
                    <span className="text-white font-bold text-lg bg-red-600 p-1">
                      SOLD OUT
                    </span>
                  )}
                </div>
                <figure className="flex justify-center items-center h-auto">
                  <Image
                    src={`${CategoryImages(String(product.category))}`}
                    alt={product.name}
                    width={190}
                    height={80}
                    className="rounded-xl"
                  />
                </figure>
                <div className="p-0">
                  <h2 className="card-title text-lg flex justify-center mt-1 text-gray-600">
                    {product.name}
                  </h2>
                  <div className="card-actions justify-center lg:flex gap-3.5 mt-1.5">
                    <button
                      className="btn bg-white btn-dash px-7 py-4 text-blue-800 hover:bg-blue-900 hover:text-white "
                      onClick={() => handleDetail(product)}
                    >
                      details
                    </button>
                    <button
                      className="btn bg-white btn-dash px-7 py-4 text-blue-800 hover:bg-blue-900 hover:text-white "
                      onClick={() => handleReview(product)}
                    >
                      review
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* カートボタン */}
          <div className="indicator fixed top-[23vh] right-[7vw] lg:top-[20vh] lg:right-[8vw] mb:top-[5vh] mb:right-[8vw]">
            {cartItems.length > 0 && (
              <span className="indicator-item badge badge-primary w-6 h-6 bg-blue-900 rounded-full ">
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
          <div className="indicator fixed top-[30vh] right-[7vw] lg:top-[30vh] lg:right-[8vw] mb:top-[15vh] mb:right-[8vw]">
            <button
              onClick={() => setIsOrderHistoryOpen(true)}
              className="btn btn-lg lg:btn-xl btn-error text-white btn-circle"
            >
              <ScrollText />
            </button>
          </div>
        </div>
      </main>

      {/* カートダイアログ */}
      {isCartOpen && (
        <CartDialog
          product={productDatas}
          cartItems={cartItems}
          onClose={() => setIsCartOpen(false)}
          onSave={handleBuy}
          onDelete={handleDelete}
        />
      )}

      {/* 購入履歴ダイアログ */}
      {isOrderHistoryOpen && (
        <OrderHistoryDialog
          onSave={handleSave}
          onClose={() => setIsOrderHistoryOpen(false)}
        />
      )}

      {/* レビューダイアログ */}
      {isReviewOpen && selectedProduct && (
        <ReviewDialog
          product={selectedProduct}
          onClose={() => setIsReviewOpen(false)}
        />
      )}

      {/* 商品詳細ダイアログ */}
      {isDetailsOpen && selectedProduct && (
        <DetailDialog
          product={selectedProduct}
          buyProduct={buyProduct}
          setBuyProductId={setBuyProductId}
          onAdd={handleAdd}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}
    </>
  );
};

export default ProductList;
