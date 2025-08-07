// ファイル名: EditDialog.tsx
"use client";
import React, { useState, useEffect } from "react";
import { ReviewType, ReviewRecType } from "@/app/types/type";
import { SelectStaffIcon } from "@/app/lib/utils";
import { Player } from "@lottiefiles/react-lottie-player";
import Image from "next/image";
import { useSessionStorage } from "@/app/hooks/useSessionStorage";

export const ProductReviews = () => {
  const [productReviewDatas, setProductReviewDatas] = useState<ReviewType[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const productId = "a72696";

  // ユーザーIDをセッションストレージから取得
  const userId = useSessionStorage("staffId", "0");

  const testData: ReviewRecType = {
    productId: "a72696",
    star: 5,
    comment: "Great product!",
    userId: userId,
  };

  // DBからデータ取得
  useEffect(() => {
    setLoading(true);
    fetch(`/api/review/${productId}`)
      .then((res) => res.json())
      .then((data) => setProductReviewDatas(data))
      .finally(() => setLoading(false));
  }, [productId]);
  console.log(productReviewDatas);
  // DBに登録
  const onSave = async (review: ReviewRecType) => {
    console.log("review:", review);
    const response = await fetch(`/api/review/${review.productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
      cache: "no-store",
    });
    const responseText = await response.text();
    console.log("Response text:", responseText);
  };

  // 評価を星に変換する
  const renderStarRating = (rating: number) => {
    const array = Array.from({ length: 5 }, (_, i) => i + 1);
    return (
      <div className="rating">
        {array.map((star) => (
          <div
            key={star}
            className="mask mask-star"
            aria-label={`${star} star`}
            aria-current={star === rating ? "true" : "false"}
          ></div>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* アニメーション */}
      {loading ? (
        <Player
          autoplay
          loop
          src="/lottie/Loading.json"
          style={{
            height: "100px",
            width: "100px",
          }}
        />
      ) : (
        productReviewDatas.map((product, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-3 p-3 lg:flex-row"
          >
            <div key={index} className="flex items-center gap-3 p-3">
              {renderStarRating(product.star)}
              <Image
                src={`${SelectStaffIcon((product.userIcon || 0).toString())}`}
                alt="スタッフアイコン"
                width={50}
                height={50}
                className="rounded-lg shadow-md"
              />
              <h3 className="w-32">{product.userName}</h3>
              <h3 className="w-32">{product.comment}</h3>
              <span className="text-sm text-gray-500">
                {product.date
                  ? new Date(product.date).toLocaleDateString()
                  : "Unknown"}
              </span>
            </div>
          </div>
        ))
      )}
      <div className="flex justify-center mt-4">
        <button className="btn btn-primary" onClick={() => onSave(testData)}>
          レビューを追加
        </button>
      </div>
    </>
  );
};
