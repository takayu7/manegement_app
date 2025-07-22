"use client";
import Image from "next/image";
import React, { useState } from "react";

import { Supplier, Category } from "@/app/types/type";
// import { Product, Category, Supplier } from "@/app/types/type";
import { Sofa } from "lucide-react";
// import { count } from "console";

export interface Product {
  id: string;
  name: string;
  count: number;
  image: string;
  explanation: string;
  price: number;
  category?: Category;
  supplier?: Supplier;
  cost?: number;
}
export default function Page() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const productSampleData = [
    {
      id: "1",
      name: "shoes",
      explanation:
        "A card component has a figure, a body part, and inside body there are title and actions parts",
      image: "/product/image1.jpg",
      count: 3,
      price: 5000,
    },
    {
      id: "2",
      name: "plant",
      explanation: "This plant will make the room look brighter.",
      image: "/product/image2.png",
      count: 5,
      price: 3000,
    },
    {
      id: "3",
      name: "cap",
      explanation: "cool",
      image: "/product/image4.jpg",
      count: 10,
      price: 2000,
    },
    {
      id: "4",
      name: "clothes",
      explanation: "cool",
      image: "/product/image6.jpg",
      count: 10,
      price: 2000,
    },
    {
      id: "5",
      name: "pet goods",
      explanation: "cool",
      image: "/product/image5.jpg",
      count: 10,
      price: 2000,
    },
    {
      id: "6",
      name: "plates",
      explanation: "plates",
      image: "/product/image3.jpg",
      count: 10,
      price: 2000,
    },
  ];

  return (
    <>
      <h1 className="mb-10 text-xl md:text-4xl font-bold">
        <Sofa className="inline-block mr-2.5 size-10" />
        Product list
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
        {productSampleData.map((product) => (
          <div
            key={product.id}
            className="card-body flex flex-col justify-between bg-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 h-full"
          >
            <figure className="flex justify-center">
              <Image
                src={product.image}
                alt={product.name}
                width={220}
                height={100}
                className="rounded-xl object-cover"
              />
            </figure>
            <div className="p-0">
              <h2 className="card-title text-2xl justify-center mt-1">
                {product.name}
              </h2>
              <div className="card-actions justify-center">
                <button
                  className="btn btn-success btn-wide mt-1.5 "
                  onClick={() => setSelectedProduct(product)}
                >
                  product details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* カード */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-gray-200/80 bg-opacity-50 flex items-center justify-center z-50 ">
          <div className="bg-white w-200 p-10 flex flex-row rounded-2xl">
            <div className="flex-shrink-0 inline-block mr-5">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                width={250}
                height={100}
                className=""
              />
            </div>

            <div className="flex flex-col">
              <div className="mb-5">
                <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                <p className="mt-4 text-sm">{selectedProduct.explanation}</p>
              </div>
              <div>
                <p className="mt-2">price：{selectedProduct.price}</p>
                <p className="mt-2">stock：{selectedProduct.count}</p>
              </div>
            </div>
            <button
              className="btn btn-success btn-wide self-end mt-2"
              onClick={() => setSelectedProduct(null)}
            >
              close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
