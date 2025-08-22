"use client";
import { useEffect, useState } from "react";
import React from "react";
import Image from "next/image";
import { SelectStaffIcon } from "@/app/lib/utils";
import { User } from "@/app/types/type";

// const date = new Date();
// const year = date.getFullYear();
// const month = date.getMonth() + 1;
// const nowDate = `${year}-${String(month).padStart(2, "0")}`;

type Props = {
  user: User;
  targetDate: string;
};

export const NoPlanShiftTable: React.FC<Props> = ({
  user,
  targetDate = "",
}) => {
  const [days, setDays] = useState<string[]>([]);

  // 月リスト生成
  useEffect(() => {
    // 初期状態で days を作成
    const initDate = new Date(targetDate);
    const theLastDate = new Date(
      initDate.getFullYear(),
      initDate.getMonth() + 1,
      0
    );
    const theLastDay = theLastDate.getDate();

    const initDays: string[] = [];
    for (let i = 1; i <= theLastDay; i++) {
      initDays.push(i.toString().padStart(2, "0"));
    }
    setDays(initDays);
  }, [targetDate]);

  return (
    <>
      <table key={user.id} className="table m-3 w-full border border-gray-800">
        <tbody>
          <tr>
            <th
              rowSpan={days.length + 1}
              className="border-r border-gray-800 w-40"
            >
              <Image
                src={`${SelectStaffIcon(String(user.icon))}`}
                alt="スタッフアイコン"
                width={40}
                height={40}
                className="mt-[10px] ml-[10px] mb-[10px] w-auto h-auto rounded-lg shadow-md"
              />
              <h2 className="mt-2 text-black text-lg font-semibold">
                {user.name}
              </h2>
            </th>
          </tr>

          {days.map((day) => {
            const dateKey = `${targetDate}-${day}`;
            return (
              <tr key={day}>
                <td className="p-4 mb-2 border-b border-gray-800">
                  <p className="text-sm text-gray-600">
                    {new Date(`${dateKey}T00:00:00`).toLocaleDateString()}
                    {"　　　"}予定なし
                  </p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
