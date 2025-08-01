// ファイル名: EditDialog.tsx
"use client";
import React, { useState, useEffect } from "react";
import { UserBuyParameterType } from "@/app/types/type";
import { jpMoneyChange } from "@/app/lib/utils";
import { SelectStaffIcon } from "@/app/lib/utils";
import Image from "next/image";

export interface UserBuyParameterProps {
  buyProductList: UserBuyParameterType[];
}

type UserPartDataType = {
  userid: string;
  icon: number;
  name: string;
  totalPrice: number;
};

export const UserBuyParameter: React.FC<UserBuyParameterProps> = ({
  buyProductList,
}) => {
  const [buyProductDatas, setBuyProductDatas] = useState<UserPartDataType[]>(
    []
  );
  const [totalSales, setTotalSales] = useState<number>(0);

  useEffect(() => {
    // 合計売上を計算
    setTotalSales(
      buyProductList.reduce((total, item) => total + item.price * item.count, 0)
    );
    // ユーザーごとの売上データを集計
    setBuyProductDatas(
      buyProductList.reduce((acc, item) => {
        const existingUser = acc.find((user) => user.userid === item.userid);
        if (existingUser) {
          existingUser.totalPrice += item.price * item.count;
        } else {
          acc.push({
            userid: item.userid,
            icon: item.icon,
            name: item.name,
            totalPrice: item.price * item.count,
          });
        }
        return acc;
      }, [] as UserPartDataType[])
    );
  }, [buyProductList]);

  return (
    <>
      {buyProductDatas.map((product, index) => (
        <div key={index} className="flex flex-col items-center gap-3 p-3 lg:flex-row">
          <div key={index} className="flex items-center gap-3 p-3">
          <Image
            src={`${SelectStaffIcon((product.icon || 0).toString())}`}
            alt="スタッフアイコン"
            width={50}
            height={50}
            className="rounded-lg shadow-md"
          />
          <h3 className="w-32">{product.name}</h3>
          <p className="w-20">{jpMoneyChange(product.totalPrice)}</p>
          </div>
          <progress
            className="progress progress-accent w-full"
            value={((product.totalPrice || 1) / totalSales) * 100}
            max="100"
          ></progress>
        </div>
      ))}
    </>
  );
};
