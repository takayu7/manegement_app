"use client";
import { ChangeEvent, useEffect, useState } from "react";
import React from "react";
import { ShiftType, User } from "@/app/types/type";
import { ShiftTable } from "@/app/components/shift/ShiftTable";
import { NoPlanShiftTable } from "@/app/components/shift/NoPlanShiftTable";

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const nowDate = `${year}-${String(month).padStart(2, "0")}`;

type Month = { month: string; value: string };

export const ShowShift = () => {
  const [months, setMonths] = useState<Month[]>([]);
  const [shiftList, setShiftList] = useState<ShiftType[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [targetDate, setTargetDate] = useState<string>(nowDate);
  const [loading, setLoading] = useState(true);

  // 月リスト作成
  const createMonthList = () => {
    const newMonths: Month[] = [];
    for (let i = 1; i <= 12; i++) {
      const formattedMonth = i.toString().padStart(2, "0"); // 01~12
      newMonths.push({ month: `${i}月`, value: `${year}-${formattedMonth}` });
    }
    setMonths(newMonths);
  };

  // 選択された月に応じて日付リストを作成
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setTargetDate(value);

    const targetDate = new Date(value);
    const theLastDate = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth() + 1,
      0
    );
    const theLastDay = theLastDate.getDate();

    const newDays: string[] = [];
    for (let i = 1; i <= theLastDay; i++) {
      newDays.push(i.toString().padStart(2, "0"));
    }
  };

  // 初回：月リスト生成
  useEffect(() => {
    createMonthList();

    // 初期状態で days を作成
    const initDate = new Date(nowDate);
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
  }, []);

  // targetDate 変更時にシフト取得
  useEffect(() => {
    setLoading(true);
    fetch(`/api/shift/${targetDate}`)
      .then((res) => res.json())
      .then((data) => setShiftList(data))
      .finally(() => setLoading(false));
  }, [targetDate]);

  // targetDate 変更時にユーザー情報取得
  useEffect(() => {
    setLoading(true);
    fetch(`/api/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .then(() =>
        setUsers((users) => users.filter((user) => !user.id.startsWith("c")))
      )
      .finally(() => setLoading(false));
  }, [targetDate]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-80">
          <span className="loading loading-ring loading-xs"></span>
        </div>
      ) : (
        <div>
          {/* 月セレクト */}
          <select
            onChange={handleChange}
            value={targetDate}
            className="border border-b-black rounded-xs"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.month}
              </option>
            ))}
          </select>

          {/* シフト一覧 */}
          {shiftList.length !== 0
            ? shiftList.map((shift) => (
                <ShiftTable
                  shift={shift}
                  targetDate={targetDate}
                  key={shift.userId}
                />
              ))
            : users.map((user) => (
                <NoPlanShiftTable
                  user={user}
                  targetDate={targetDate}
                  key={user.id}
                />
              ))}
        </div>
      )}
    </>
  );
};
