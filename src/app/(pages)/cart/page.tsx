"use client";
import React, { useState } from "react";
import { CustomerCart } from '@/app/components/cart/CustomerCart';
import { AfterBuyCart } from "@/app/components/cart/AfterBuyCart";
import { userItemsType } from "@/app/types/type";

export default function Page() {

  const [buyLaterList, setBuyLaterList] = useState<userItemsType[]>([]);

  return (
    <>
      <div className="space-y-6">
        <h1 className="mb-10 text-xl md:text-4xl font-bold ">Cart</h1>
          <CustomerCart setBuyLaterList={setBuyLaterList}/>
          <AfterBuyCart buyLaterList={buyLaterList} setBuyLaterList={setBuyLaterList}/>
      </div>
    </>
  );
}
