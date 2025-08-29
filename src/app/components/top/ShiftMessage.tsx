"use client";
import { ShiftDataType, ShiftType } from "@/app/types/type";
import { useCallback, useEffect, useState } from "react";

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const nowDate = `${year}-${String(month).padStart(2, "0")}`;

export const ShiftMessage = () => {
  const [shiftList, setShiftList] = useState<ShiftType[]>([]);
  const [loginUserShift, setLoginUserShift] = useState<
    (ShiftDataType | undefined)[]
  >([]);
  const [userId, setUserId] = useState<string>("0");

  const fetchShift = (targetDate: string) => {
    fetch(`/api/shift/targetDate/${targetDate}`)
      .then((res) => res.json())
      .then((data) => setShiftList(data));
  };
  // targetDate 変更時にシフト取得
  useEffect(() => {
    fetchShift(nowDate);
  }, []);

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

  const newShiftList = useCallback(() => {
    const loginUserShift = shiftList.filter(
      (shift: ShiftType) => shift.userId === userId
    );
    const loginUserTodayShift = loginUserShift.map((shift) => {
      return shift.shiftData.find(
        (shiftData) =>
          shiftData.status === 1 &&
          new Date(shiftData.shiftDate).getFullYear() ===
            new Date().getFullYear() &&
          new Date(shiftData.shiftDate).getMonth() === new Date().getMonth() &&
          new Date(shiftData.shiftDate).getDate() === new Date().getDate()
      );
    });
    setLoginUserShift(() => loginUserTodayShift);
  }, [userId, shiftList]);

  useEffect(() => {
    newShiftList();
  }, [newShiftList]);

  //startTimeとendTimeを、hh:mm の形式に変換する処理
  const formatTime = (time: string) => {
    const [h, m] = time.split(":");
    return h + ":" + m;
  };

  return (
    <>
      <div className="h-0 flex items-center">
        <div
          className="relative top-13 left-5 max-w-55 rounded-2xl border border-blue-300 bg-blue-100 p-4 text-blue-900 shadow
           after:content-[''] after:absolute after:-bottom-2 after:left-8
           after:block sm:after:h-4 sm:after:w-4 after:rotate-45 after:bg-blue-100
           after:border-r after:border-b after:border-white sm:after:border-blue-300 sm:top-10 sm:left-65 sm:max-w-100 md:top-10 md:left-50 md:max-w-100 lg:top-5 lg:left-10 lg:max-w-sm lg:max-h-20"
        >
          {loginUserShift[0] !== undefined ? (
            <div>
              {loginUserShift.map(
                (shift, index) =>
                  typeof shift?.startTime === "string" &&
                  typeof shift?.endTime === "string" && (
                    <div key={index}>
                      I’m at work from{" "}
                      <span className="font-bold">
                        {formatTime(shift.startTime)}
                      </span>{" "}
                      to{" "}
                      <span className="font-bold">
                        {formatTime(shift?.endTime)}
                      </span>
                      {`\u0020`}
                      {`\u0021`}
                      <br />
                      Let’s do our best today{`\u0020`}
                      {`\u0021`}
                    </div>
                  )
              )}
            </div>
          ) : (
            <div className="flex items-center">Today is a holiday</div>
          )}
        </div>
      </div>
    </>
  );
};
