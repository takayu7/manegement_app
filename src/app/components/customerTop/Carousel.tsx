"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Product } from "@/app/types/type";
import Image from "next/image";
import CarouselDetailDialog from "@/app/components/customerTop/CarouselDetailDialog";
import { CategoryImages } from "@/app/lib/utils";

export const TopCarousel = () => {
  const [productDatas, setProductDatas] = useState<Product[]>([]);
  const [isCarouselDetailOpen, setIsCarouselDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // 商品データの取得
  useEffect(() => {
    fetch(`/api/products`)
      .then((res) => res.json())
      .then((data) => setProductDatas(data));
  }, []);

  const handleDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsCarouselDetailOpen(true);
  };

  return (
    <>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="justify-center max-w-4xl items-center "
      >
        <CarouselContent>
          {productDatas.map((product) => (
            <CarouselItem
              key={product.id}
              className="sm:basis-1/2 lg:basis-1/3 "
              onClick={() => handleDetail(product)}
            >
              <div className="p-1">
                <Card className="bg-gray-100 h-70 w-70 max-w-sm flex group">
                  <CardContent className="flex aspect-video items-center justify-center p-0">
                    <Image
                      src={`${CategoryImages(String(product.category))}`}
                      alt={product.name}
                      width={500}
                      height={500}
                      className="rounded-xl object-cover h-full m-full flex items-center transition-transform duration-300 group-hover:scale-95"
                    />
                  </CardContent>
                  <CardFooter className="absolute top-35 flex rounded-r-lg w-50 h-30 bg-black/40 ">
                    <div className="h-30 w-3 bg-orange-500 group-hover:bg-cyan-500 absolute left-0 transition-colors duration-300" />
                    <span className="text-lg tracking-wide text-white font-bold">
                      {product.name}
                    </span>
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

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

export default TopCarousel;
