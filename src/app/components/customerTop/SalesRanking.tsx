"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/app/types/type";
import { Button } from "@/components/ui/button";
// import { date } from "zod";
// import { fa } from "zod/v4/locales";
// import { Button } from "@/components/ui/button";

export const SalesRanking = () => {
  const [productDatas, setProductDatas] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 商品データの取得
  useEffect(() => {
    fetch(`/api/products`)
      .then((res) => res.json())
      .then((data) => setProductDatas(data))
      .finally(() => setLoading(false));
  }, []);

  // useEffect(() => {
  //   if (productDatas.length === 0) return;
  //   const salesArray = [...productDatas];
  // return()=>setProductDatas(salesArray.sort((a, b) => b.order - a.order))
  // console.log(setProductDatas);
  // }, [productDatas]);

  const handleClick = () => {
    const salesArray = [...productDatas];
    setProductDatas(salesArray.sort((a, b) => b.order - a.order));
  };

  return (
    <>
      <Table>
        <TableCaption>Sales Ranking</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Ranking</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {productDatas.map((product, index) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell className="text-right">{product.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>

        {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>
      <Button onClick={handleClick}>Ranking</Button>
    </>
  );
};

export default SalesRanking;
