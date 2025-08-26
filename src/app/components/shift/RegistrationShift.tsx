"use client";
import { useEffect, useState, useCallback } from "react";
import React from "react";
import { ShiftType, ShiftDataType } from "@/app/types/type";

const statesList = [
  { key: 0, value: "未定" },
  { key: 1, value: "出勤" },
  { key: 2, value: "休み" },
  { key: 3, value: "有給" },
];

// 指定月の月初〜月末の配列を生成
function generateMonthShiftData(year: number, month: number) {
  const lastDay = new Date(year, month, 0).getDate();
  return Array.from({ length: lastDay }, (_, i) => ({
    // UTCの0時で生成
    shiftDate: new Date(Date.UTC(year, month - 1, i + 1, 0, 0, 0)),
    startTime: "",
    endTime: "",
    status: 0,
  }));
}

const defaultData: ShiftType = {
  userId: "",
  name: "",
  icon: "",
  shiftData: generateMonthShiftData(2025, 8) as ShiftDataType[], // 2025年8月分で仮指定※変更要！！
};

const targetDate = "2025-08";

export const RegistrationShift = () => {
  const [shiftList, setShiftList] = useState<ShiftType[]>([]);
  const [loading, setLoading] = useState(true);
  const [shiftData, setShiftData] = useState<ShiftType>(defaultData);
  const [userId, setUserId] = useState<string>("");

  console.log(shiftData);
  console.log(shiftList);

  // セッションストレージからユーザーIDを取得して状態を更新する関数
  const updateHeaderInfo = useCallback(() => {
    const storedId = sessionStorage.getItem("staffId") || "0";
    setUserId(storedId);
  }, []);

  //再ログイン時にuserIdの値を更新する
  useEffect(() => {
    updateHeaderInfo();
    const handler = () => updateHeaderInfo();
    window.addEventListener("headerUpdate", handler);
    return () => {
      window.removeEventListener("headerUpdate", handler);
    };
  }, [updateHeaderInfo]);

  //フォームのIDにSessionStorageで取得したIDを挿入する
  useEffect(() => {
    setShiftData((prev) => ({ ...prev, userId }));
  }, [userId]);

  //DBからデータの取得
  useEffect(() => {
    setLoading(true);
    fetch(`/api/shift/targetDate/${targetDate}`)
      .then((res) => res.json())
      .then((data) => setShiftList(data))
      .finally(() => setLoading(false));
  }, []);

  //取得したデータをフォーマットに挿入
  useEffect(() => {
    if (shiftList.length > 0) {
      //userIDと一致するシフトを探す
      const userShift = shiftList.find((t) => t.userId === userId);
      //useStateのデータを更新
      setShiftData((data) => ({
        ...data,
        shiftData: data.shiftData.map((s) => {
          const matchingShift = userShift?.shiftData.find((t) => {
            const tDate = new Date(t.shiftDate);
            const sDate = new Date(s.shiftDate);
            return (
              tDate.getFullYear() === sDate.getFullYear() &&
              tDate.getMonth() === sDate.getMonth() &&
              tDate.getDate() === sDate.getDate()
            );
          });
          if (matchingShift) {
            return {
              ...s,
              startTime: matchingShift.startTime,
              endTime: matchingShift.endTime,
              status: matchingShift.status,
            };
          }
          return s;
        }),
      }));
    }
  }, [userId, shiftList]);
  // DBに登録
  const onSave = async (shift: ShiftType) => {
    //　空のデータは省いて整理する
    const newShift = {
      ...shift,
      shiftData: shift.shiftData
        .filter((s) => {
          if (!s.shiftDate) return false;
          const dateStr =
            s.shiftDate instanceof Date
              ? s.shiftDate.toISOString().slice(0, 7)
              : String(s.shiftDate).slice(0, 7);
          return (
            dateStr === targetDate && ((s.startTime && s.endTime) || s.status) //時間またはステータスが入っているものだけを残す
          );
        })
        //残ったシフトデータのshiftDateを（"YYYY-MM-DD"形式）に変換
        .map((s) => ({
          ...s,
          shiftDate:
            s.shiftDate instanceof Date
              ? s.shiftDate.toISOString().slice(0, 10)
              : s.shiftDate,
        })),
    };
    console.log("newShift:", newShift);
    //DBに登録依頼
    const response = await fetch(`/api/shift/targetDate/${targetDate}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newShift),
      cache: "no-store",
    });
    const responseText = await response.text();
    console.log("Response text:", responseText);
  };

  return (
    <>
      <h1>登録</h1>
      {loading && <p>Loading...</p>}
      <p>{shiftData.userId}</p>
      <div className="w-2/3 bg-blue-300 p-1">
        {shiftData.shiftData.map((s, index) => (
          <div key={index} className="grid grid-cols-7 gap-2 mb-2">
            <p className="my-auto">{s.shiftDate.toLocaleDateString()}</p>
            <select
              id={`status${index}`}
              name={`status${index}`}
              value={s.status}
              required
              onChange={(e) => {
                setShiftData((prev) => ({
                  ...prev,
                  shiftData: prev.shiftData.map((shift, i) =>
                    i === index
                      ? {
                          ...shift,
                          status: Number(e.target.value),
                          startTime:
                            Number(e.target.value) !== 1 ? "" : shift.startTime,
                          endTime:
                            Number(e.target.value) !== 1 ? "" : shift.endTime,
                        }
                      : shift
                  ),
                }));
              }}
              className={`select rounded-sm border-3 p-1 text-lg border-gray-500 focus:border-pink-500 focus:input-secondary ${
                s.startTime ? "select-secondary" : ""
              }`}
            >
              <option value=""></option>
              {statesList.map((state) => (
                <option
                  key={state.key}
                  value={state.key}
                  className={`${state.key === 3 ? "bg-red-300" : ""}`}
                >
                  {state.value}
                </option>
              ))}
            </select>
            <select
              id={`startTime${index}`}
              name={`startTime${index}`}
              disabled={s.status !== 1}
              value={
                s.status === 1 && s.startTime
                  ? Number((s.startTime || "").slice(0, 2)) || ""
                  : ""
              }
              onChange={(e) => {
                const newStartTime = e.target.value.padStart(2, "0") + ":00";
                setShiftData((prev) => ({
                  ...prev,
                  shiftData: prev.shiftData.map((shift, i) =>
                    i === index ? { ...shift, startTime: newStartTime } : shift
                  ),
                }));
              }}
              required
              className={`select rounded-sm border-2 p-1 text-lg border-gray-500 focus:border-pink-500 focus:input-secondary ${
                s.startTime ? "select-secondary" : ""
              }`}
            >
              <option value="">start</option>
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <p className="my-auto">:00</p>
            <p className="my-auto">-</p>
            <select
              id={`endTime${index}`}
              name={`endTime${index}`}
              disabled={s.status !== 1}
              value={
                s.status === 1 && s.endTime
                  ? Number((s.endTime || "").slice(0, 2)) || ""
                  : ""
              }
              required
              onChange={(e) => {
                const newEndTime = e.target.value.padStart(2, "0") + ":00";
                setShiftData((prev) => ({
                  ...prev,
                  shiftData: prev.shiftData.map((shift, i) =>
                    i === index ? { ...shift, endTime: newEndTime } : shift
                  ),
                }));
              }}
              className={`select rounded-sm border-2 p-1 text-lg border-gray-500 focus:border-pink-500 focus:input-secondary ${
                s.startTime ? "select-secondary" : ""
              }`}
            >
              <option value="">end</option>
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <p className="my-auto">:00</p>
            {/* <p className="my-auto">
            {statesList.find((item) => item.key === s.status)?.value || "未定"}
          </p> */}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <button className="btn btn-primary" onClick={() => onSave(shiftData)}>
          保存
        </button>
      </div>
    </>
  );
};
