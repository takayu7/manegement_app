"use client";
import { useEffect, useState } from "react";
import React from "react";
import { ShiftType } from "@/app/types/type";

const statesList =[
  {key:0, value:"未定"},
  {key:1, value:"出勤"},
  {key:2, value:"休み"},
  {key:3, value:"有給"},
]


export default function Page() {
  const [shiftList, setShiftList] = useState<ShiftType[]>([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
      setLoading(true);
      fetch(`/api/shift`)
        .then((res) => res.json())
        .then((data) => setShiftList(data))
        .finally(() => setLoading(false));
    }, []);

    console.log(shiftList);

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-xl">Shift</h1>
                {loading ? (
                  <div className="flex justify-center items-center h-80">
                    <span className="loading loading-ring loading-xs"></span>
                  </div>
                ) : (
                  shiftList.map((shift) => (
                    <div key={shift.userId} className="p-4 border rounded-md">
                      <h2 className="text-lg font-semibold">{shift.name}</h2>
                      <p className="text-sm text-gray-600">
                        {new Date(shift.shiftDate).toLocaleDateString()} - {shift.startTime} to {shift.endTime}
                      </p>
                      <p className="text-sm text-gray-600">
                        {statesList.find(item=> item.key === shift.status)?.value || "未定"}
                      </p>
                    </div>
                  ))
                )}
      </div>
    </>
  );
}
