"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
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

export const StarRanking = () => {
  const [productDatas, setProductDatas] = useState<Product[]>([]);
  const [allReview, setAllReview] = useState<ReviewType[]>([]);
  const [isCarouselDetailOpen, setIsCarouselDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // 商品データの取得
  useEffect(() => {
    fetch(`/api/products`)
      .then((res) => res.json())
      .then((data) => setProductDatas(data));
  }, []);

  // DBからデータ取得
  useEffect(() => {
    fetch(`/api/allReview`)
      .then((res) => res.json())
      .then((data) => setAllReview(data));
  }, []);

  // 各商品ごとの平均評価を計算
  const averageStarRating = (productId: string) => {
    const productReviews = allReview.filter(
      (review) => review.productId === productId
    );
    const totalStars = productReviews.reduce(
      (acc, review) => acc + review.star,
      0
    );
    return totalStars / productReviews.length;
  };

  const handleDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsCarouselDetailOpen(true);
  };

  return (
    <>
      <Table>
        <TableCaption>Star Ranking</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Ranking</TableHead>
            <TableHead>Review</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {productDatas.map((product, index) => (
            <TableRow
              key={product.id}
              onClick={() => handleDetail(product)}
              // className={
              //   index === 0
              //     ? "bg-yellow-400 hover:bg-yellow-200"
              //     : index === 1
              //     ? "bg-gray-300 hover:bg-gray-200"
              //     : index === 2
              //     ? "bg-orange-700  text-white  hover:bg-orange-300 hover:text-black"
              //     : ""
              // }
            >
              <TableCell className="font-medium">
                {index + 1}
                {/* {index === 0 && (
                  <div className="pl-3">
                    <Trophy />
                  </div>
                )} */}
              </TableCell>
              <TableCell className=" ">
                {renderStarRating(Math.round(averageStarRating(product.id)))}
              </TableCell>
              <TableCell>{product.name}</TableCell>
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
