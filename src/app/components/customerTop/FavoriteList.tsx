"use client";
import React, { useState, useEffect } from "react";
import { Product, userItemsType } from "@/app/types/type";
import { jpMoneyChange } from "@/app/lib/utils";
import CarouselDetailDialog from "@/app/components/customerTop/CarouselDetailDialog";
import { useSessionStorage } from "@/app/hooks/useSessionStorage";
import { Heart } from "lucide-react";

export const FavoriteList = () => {
  const [productDatas, setProductDatas] = useState<Product[]>([]);
  const [isCarouselDetailOpen, setIsCarouselDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [favorite, setFavorite] = useState<userItemsType[]>([]);

  const userId = useSessionStorage("staffId", "0");

  // 商品データの取得
  useEffect(() => {
    fetch(`/api/products`)
      .then((res) => res.json())
      .then((data) =>
        setProductDatas(
          data.filter((i: Product) =>
            favorite.some((f) => f.productId === i.id)
          )
        )
      );
  }, [favorite]);

  //DBからfavoriteデータの取得
  useEffect(() => {
    if (userId === "0") return;
    fetch(`/api/favorite/${userId}`)
      .then((res) => res.json())
      .then((data) => setFavorite(data));
  }, [userId]);

  const handleDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsCarouselDetailOpen(true);
  };

  return (
    <>
      {productDatas.length > 0 ? (
        <ul className="grid items-center gap-3 lg:grid-cols-2 overflow-x-auto mt-2">
          {productDatas.map((product) => (
            <li
              key={product.id}
              className="p-5 flex items-center gap-3 rounded-lg bg-pink-50 border border-pink-100 shadow-sm hover:shadow-xl hover:bg-pink-100"
              onClick={() => handleDetail(product)}
            >
              <div className="font-medium flex ">
                <Heart className="w-4 h-4 text-red-500" />
              </div>
              <div className="flex lg:flex-row flex-col lg:justify-between flex-1">
                <p>{product.name}</p>
                <p>
                  {jpMoneyChange(product.price)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 italic p-5">No Favorite</p>
      )}

      {/* 商品詳細ダイアログ */}
      {isCarouselDetailOpen && selectedProduct && (
        <CarouselDetailDialog
          product={selectedProduct}
          onClose={() => setIsCarouselDetailOpen(false)}
        />
      )}
    </>
  );
};

export default FavoriteList;
