"use client";
import React, { useEffect, useState } from "react";
// import useStore from "@/app/store/useStore";
import { Product } from "@/app/types/type";

export const Test = () => {
  const [productData, setProductData] = useState<Product[]>([]);
  const [Loading, setLoading] = useState(false);

  const productId = "d29616";

  useEffect(() => {
    setLoading(true);
    fetch(`/api/product/${productId}`)
      .then((res) => res.json())
      .then((data) => setProductData(data))
      .finally(() => setLoading(false));
  }, [productId]);

  console.log(productData);

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
        </ul>
      )}
    </>
  );
};
