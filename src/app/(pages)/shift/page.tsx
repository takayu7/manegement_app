"use client";
import { useEffect, useState } from "react";
import React from "react";
import { ShiftType } from "@/app/types/type";

const statesList = [
  { key: 0, value: "未定" },
  { key: 1, value: "出勤" },
  { key: 2, value: "休み" },
  { key: 3, value: "有給" },
];

const sampleData: ShiftType = {
  userId: "328886",
  name: "山田太郎",
  shiftData: [
    {
      shiftDate: new Date("2025-08-01"),
      startTime: "10:00:00", // ← ここを修正
      endTime: "18:00:00",
      status: 1,
    },
  ],
};

const targetDate = "2025-08";

export default function Page() {
  const [shiftList, setShiftList] = useState<ShiftType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/shift/${targetDate}`)
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
          <div>
            {shiftList.map((shift) => (
              <div key={shift.userId}>
                <h2 className="text-lg font-semibold">{shift.name}</h2>
                {shift.shiftData.map((s) => (
                  <div
                    key={s.shiftDate.toString()}
                    className="p-4 border rounded-md"
                  >
                    <p className="text-sm text-gray-600">
                      {new Date(s.shiftDate).toLocaleDateString()} -{" "}
                      {s.startTime} to {s.endTime}
                    </p>
                    <p className="text-sm text-gray-600">
                      {statesList.find((item) => item.key === s.status)
                        ?.value || "未定"}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
