"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/app/types/type";
import { ReviewType } from "@/app/types/type";
import { renderStarRating, jpMoneyChange } from "@/app/lib/utils";
import CarouselDetailDialog from "@/app/components/customerTop/CarouselDetailDialog";
import { Trophy } from "lucide-react";

type RankList = {
  productId: string;
  name: string;
  price: number;
  star: number;
};

export const StarRanking = () => {
  const [productDatas, setProductDatas] = useState<Product[]>([]);
  const [rankDatas, setRankDatas] = useState<RankList[]>([]);
  const [allReview, setAllReview] = useState<ReviewType[]>([]);
  const [isCarouselDetailOpen, setIsCarouselDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // 商品データの取得
  useEffect(() => {
    fetch(`/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProductDatas(data);
      });
  }, []);

  // DBからレビューのデータ取得
  useEffect(() => {
    fetch(`/api/allReview`)
      .then((res) => res.json())
      .then((data) => {
        setAllReview(data);
        console.log(data);
      });
  }, []);

  // 各商品ごとの平均評価
  const averageStarRating = useCallback(
    (productId: string) => {
      const productReviews = allReview.filter(
        (review) => review.productId === productId
      );
      if (productReviews.length === 0) return 0;
      const totalStars = productReviews.reduce(
        (acc, review) => acc + review.star,
        0
      );
      const average = totalStars / productReviews.length;
      return Math.round(average * 10) / 10;
    },
    [allReview]
  );

  useEffect(() => {
    const newProduct = productDatas;
    const newReview = allReview
      .map((i) => ({
        star: averageStarRating(i.productId),
        productId: i.productId,
        name: newProduct.find((item) => item.id === i.productId)?.name,
        price: newProduct.find((item) => item.id === i.productId)?.price,
      }))
      .sort((a, b) => b.star - a.star)
      .reduce((acc, review) => {
        const exists = acc.some((item) => item.productId === review.productId);
        if (!exists) {
          acc.push({
            productId: review.productId,
            name: review.name || "",
            price: review.price || 0,
            star: review.star,
          });
        }
        return acc;
      }, [] as RankList[])
      .slice(0, 5);
    setRankDatas(newReview);
    console.log(newReview);
  }, [productDatas, allReview, averageStarRating]);

  // 詳細ボタン
  const handleDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsCarouselDetailOpen(true);
  };

  return (
    <>
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Ranking</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="pl-10">Review</TableHead>
            <TableHead></TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rankDatas.map((product, index) => (
            <TableRow
              key={product.productId}
              onClick={() => {
                const selected = productDatas.find(
                  (data) => data.id === product.productId
                );
                if (selected) handleDetail(selected);
              }}
              className={
                index === 0
                  ? "bg-yellow-400 hover:bg-yellow-200"
                  : index === 1
                  ? "bg-gray-300 hover:bg-gray-200"
                  : index === 2
                  ? "bg-orange-700 text-white hover:bg-orange-300 hover:text-black"
                  : "hover:bg-gray-100"
              }
            >
              <TableCell className="font-medium flex">
                {index + 1}
                {index === 0 && (
                  <div className="pl-3">
                    <Trophy />
                  </div>
                )}
              </TableCell>
              <TableCell className="size-10">{product.name}</TableCell>
              <TableCell className="size-10 pl-10 ">
                {renderStarRating(
                  Math.round(averageStarRating(product.productId))
                )}
              </TableCell>
              <TableCell className="items-center pl-2">
                {averageStarRating(product.productId)}
              </TableCell>

              <TableCell className="text-right">
                {jpMoneyChange(product.price)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* 商品詳細ダイアログ */}
      {isCarouselDetailOpen && (
        <CarouselDetailDialog
          product={selectedProduct}
          onClose={() => setIsCarouselDetailOpen(false)}
        />
      )}
    </>
  );
};

export default StarRanking;
