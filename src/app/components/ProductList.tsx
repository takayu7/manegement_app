"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
// import { jpMoneyChange } from "@/app/lib/utils";
import { Product, Supplier, Category } from "@/app/types/type";
// import { Product, Category, Supplier } from "@/app/types/type";
import { Sofa } from "lucide-react";
// import { count } from "console";

export interface ProductListProps {
  productDataList: Product[];
  categoryList: Category[];
  supplierList: Supplier[];
}

export const ProductList: React.FC<ProductListProps> = ({
  productDataList,
  // categoryList,
  // supplierList,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productDatas, setProductDatas] = useState<Product[]>(productDataList);

  const CategoryImages: Record<string, string> = {
    "1": "/product/image2.jpg",
    "2": "/product/image6.jpg",
    "3": "/product/image4.jpg",
    "4": "/product/image3.jpg",
    "5": "/product/image7.jpg",
    "6": "/product/image5.jpg",
    "7": "/product/image1.jpg",
  };

  useEffect(() => {
    setProductDatas(productDataList);
  }, [productDataList]);

  return (
    <>
      <h1 className="mb-10 text-xl md:text-4xl font-bold">
        <Sofa className="inline-block mr-2.5 size-10" />
        Product list
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
        {productDatas.map((product) => (
          <div
            key={product.id}
            className="card-body flex flex-col justify-between bg-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 h-full"
          >
            <figure className="flex justify-center">
              <Image
                src={CategoryImages[product.category]}
                alt={product.name}
                width={220}
                height={100}
                className="rounded-xl object-cover"
              />
            </figure>
            <div className="p-0">
              <h2 className="card-title text-xl justify-center mt-1 text-gray-600">
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

      {/* カード */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-gray-200/80 bg-opacity-50 flex items-center justify-center z-50 ">
          <div className="bg-white w-200 p-10 flex flex-row rounded-2xl">
            <div className="flex-shrink-0 inline-block mr-5">
              <Image
                src={CategoryImages[selectedProduct.category]}
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
};

export default ProductList;
