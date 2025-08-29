"use client";
import { ShiftDataType, ShiftType } from "@/app/types/type";
import { useCallback, useEffect, useState } from "react";

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const nowDate = `${year}-${String(month).padStart(2, "0")}`;

type allUserTodayShiftType = {
  name: string;
  shiftData: ShiftDataType | undefined;
};

export const ShiftMessageForAdmin = () => {
  const [shiftList, setShiftList] = useState<ShiftType[]>([]);
  const [allUserTodayShift, setAllUserTodayShift] = useState<
    allUserTodayShiftType[]
  >([]);

  const fetchShift = (targetDate: string) => {
    fetch(`/api/shift/targetDate/${targetDate}`)
      .then((res) => res.json())
      .then((data) => setShiftList(data));
  };
  // targetDate 変更時にシフト取得
  useEffect(() => {
    fetchShift(nowDate);
  }, []);

  const newShiftList = useCallback(() => {
    const shiftUserName = shiftList.map((shift) => {
      return shift.name;
    });
    const TodayShiftData = shiftList.map((shift) => {
      return shift.shiftData.find(
        (shiftData) =>
          new Date(shiftData.shiftDate).getFullYear() ===
            new Date().getFullYear() &&
          new Date(shiftData.shiftDate).getMonth() === new Date().getMonth() &&
          new Date(shiftData.shiftDate).getDate() === new Date().getDate()
      );
    });
    let newShiftList: allUserTodayShiftType[] = [];
    for (let i = 0; i < shiftUserName.length; i++) {
      newShiftList = [
        ...newShiftList,
        { name: shiftUserName[i], shiftData: TodayShiftData[i] },
      ];
    }
    setAllUserTodayShift(() => newShiftList);
  }, [shiftList]);

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
      <div className="flex items-center lg:mt-[-85px]">
        <div
          className="relative top-15 left-5 max-w-55 rounded-2xl border border-blue-300 bg-blue-100 p-4 text-blue-900 shadow
           after:content-[''] after:absolute after:-bottom-2 after:left-8
           after:block sm:after:h-4 sm:after:w-4 after:rotate-45 after:bg-blue-100
           after:border-r after:border-b after:border-white sm:after:border-blue-300 sm:top-20 sm:left-65 sm:max-w-100 md:top-20 md:left-30 md:max-w-100 lg:top-15 lg:left-10 lg:max-w-65"
        >
          {allUserTodayShift.map((shift, index) =>
            shift.shiftData?.status === 1 &&
            typeof shift.shiftData.startTime === "string" &&
            typeof shift.shiftData.endTime === "string" ? (
              <div key={index} className="my-3">
                <span className="font-bold">{shift.name}</span> will be at work
                from{" "}
                <span className="font-bold">
                  {formatTime(shift.shiftData.startTime)}
                </span>{" "}
                to{" "}
                <span className="font-bold">
                  {formatTime(shift.shiftData.endTime)}
                </span>
              </div>
            ) : (
              index === 0 &&
              !allUserTodayShift.some(
                (shift) => shift.shiftData?.status === 1
              ) && <div key={index}>No one is scheduled to work...</div>
            )
          )}
        </div>
      </div>
    </>
  );
};
