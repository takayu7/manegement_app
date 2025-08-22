"use client";
import { useEffect, useState } from "react";
import React from "react";
import Image from "next/image";
import { SelectStaffIcon } from "@/app/lib/utils";
import { ShiftType } from "@/app/types/type";

// const date = new Date();
// const year = date.getFullYear();
// const month = date.getMonth() + 1;
// const nowDate = `${year}-${String(month).padStart(2, "0")}`;

const statesList = [
  { key: 0, value: "未定" },
  { key: 1, value: "出勤" },
  { key: 2, value: "休み" },
  { key: 3, value: "有給" },
];

type Props = {
  shift: ShiftType;
  targetDate: string;
};

export const ShiftTable: React.FC<Props> = ({ shift, targetDate = "" }) => {
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
      <table
        key={shift.userId}
        className="table m-3 w-full border border-gray-800"
      >
        <tbody>
          <tr>
            {/* 左側にスタッフ情報 */}
            <th
              rowSpan={days.length + 1}
              className="border-r border-gray-800 w-40"
            >
              <Image
                src={`${SelectStaffIcon(String(shift.icon))}`}
                alt="スタッフアイコン"
                width={40}
                height={40}
                className="mt-[10px] ml-[10px] mb-[10px] w-auto h-auto rounded-lg shadow-md"
              />
              <h2 className="mt-2 text-black text-lg font-semibold">
                {shift.name}
              </h2>
            </th>
          </tr>

          {/* 日ごとのシフト */}
          {days.map((day) => {
            const dateKey = `${targetDate}-${day}`;
            const shiftForDay = shift.shiftData.find((s) =>
              String(s.shiftDate).startsWith(dateKey)
            );
            let timeZone = "　　　　　　　　";
            if (shiftForDay !== undefined && shiftForDay.status !== 0) {
              if (
                shiftForDay.startTime === null ||
                shiftForDay.endTime === null
              ) {
                timeZone = "　　　終日　　　";
              } else {
                timeZone = shiftForDay.startTime + "～" + shiftForDay.endTime;
              }
            }

            return (
              <tr key={day}>
                <td className="p-4 mb-2 border-b border-gray-800">
                  <p className="text-sm text-gray-600">
                    {new Date(`${dateKey}T00:00:00`).toLocaleDateString()}
                    {"　　　"}
                    {shiftForDay
                      ? `${timeZone}　　　${
                          statesList.find(
                            (item) => item.key === shiftForDay.status
                          )?.value || "未定"
                        }`
                      : "予定なし"}
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
