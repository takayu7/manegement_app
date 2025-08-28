"use client";
import React, { startTransition, useEffect, useState } from "react";
// import useStore from "@/app/store/useStore";
import { Product } from "@/app/types/type";
import { useSessionStorage } from "@/app/hooks/useSessionStorage";
import { userItemsType } from "@/app/types/type";
import { Heart } from "lucide-react";

type SetProductDatas = React.Dispatch<React.SetStateAction<userItemsType[]>>;

export const onSave = async (
  productId: string,
  userId: string,
  isFavorite: boolean,
  setFavoriteList: SetProductDatas
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

export const Test = () => {
  const [productData, setProductData] = useState<Product[]>([]);
  const [Loading, setLoading] = useState(false);
  const [favoriteList, setFavoriteList] = useState<userItemsType[]>([]);

  const productId = "d29616";
  const userId = useSessionStorage("staffId", "0");
  useEffect(() => {
    setLoading(true);
    fetch(`/api/product/${productId}`)
      .then((res) => res.json())
      .then((data) => setProductData(data))
      .finally(() => setLoading(false));
  }, [productId]);

  //DBからデータの取得
  useEffect(() => {
    if (userId === "0") return;
    setLoading(true);
    fetch(`/api/favorite/${userId}`)
      .then((res) => res.json())
      .then((data) => setFavoriteList(data))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleAdd = (productId: string, isFavorite: boolean) => {
    startTransition(() => {
      onSave(productId, userId, isFavorite, setFavoriteList);
    });
  };

  const sampleList = [
    {
      id: "d29616",
      name: "ナイキ エア フォース 1 ‘07 LV8",
    },
    {
      id: "f05860",
      name: "カレー皿　約21cm　電子レンジ対応",
    },
  ];

  console.log(favoriteList);

  return (
    <>
      {Loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {productData.map((product) => (
            <li key={product.id}>
              {product.name}, {product.price}, {product.count}
            </li>
          ))}
          {sampleList.map((product) => (
            <li key={product.id} className="flex items-center gap-3">
              <p>{product.id}</p>
              <p>{product.name}</p>
              <button
                className={`btn btn-circle ${
                  favoriteList.some((f) => f.productId === product.id)
                    ? "bg-pink-400"
                    : "bg-indigo-500"
                } text-white hover:opacity-75 p-1 `}
                onClick={() =>
                  handleAdd(
                    product.id,
                    !favoriteList.some((f) => f.productId === product.id)
                  )
                }
              >
                <Heart className="w-3 h-3"/>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
