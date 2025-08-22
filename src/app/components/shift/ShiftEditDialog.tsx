"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import React from "react";
import { ShiftType, ShiftListType } from "@/app/types/type";
// import z, { regex } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

const statesList = [
  { key: 0, value: "未定" },
  { key: 1, value: "出勤" },
  { key: 2, value: "休み" },
  { key: 3, value: "有給" },
];

type Prop = {
  userId: string;
  name: string;
  targetDate: string;
  onSaveButtonClick: (targetDate: string) => void;
};

export const ShiftEditDialog: React.FC<Prop> = ({
  userId,
  name,
  targetDate,
  onSaveButtonClick,
}) => {
  // 指定月の月初〜月末の配列を生成
  const generateMonthShiftData = useCallback(() => {
    // 初期状態で days を作成
    const initDate = new Date(targetDate);
    const year = initDate.getFullYear();
    const month = initDate.getMonth() + 1;
    const theLastDate = new Date(year, month, 0);
    const theLastDay = theLastDate.getDate();
    return Array.from({ length: theLastDay }, (_, i) => ({
      // UTCの0時で生成
      shiftDate: new Date(Date.UTC(year, month - 1, i + 1, 0, 0, 0)),
      startTime: "",
      endTime: "",
      status: 0,
    }));
  }, [targetDate]);

  const defaultData = useMemo(() => {
    return {
      userId: "",
      name: "",
      icon: "",
      shiftData: generateMonthShiftData() as ShiftListType[],
    };
  }, [generateMonthShiftData]);

  const parseTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const second = h * 60 + m;
    return second;
  };

  // //入力フォームのバリデーション
  // const formSchema = z
  //   .object({
  //     shiftDate: z.date(),
  //     startTime: z.string().regex(/^\d{2}:\d{2}$/),
  //     endTime: z.string().regex(/^\d{2}:\d{2}$/),
  //     status: z.number(),
  //   })
  //   .superRefine((data, ctx) => {
  //     if (parseTime(data.startTime) >= parseTime(data.endTime)) {
  //       ctx.addIssue({
  //         code: "custom",
  //         message: "開始時間は終了時間よりも小さいの値を指定してください。",
  //         path: ["startTime"],
  //       });
  //       ctx.addIssue({
  //         code: "custom",
  //         message: "終了時間は開始時間よりも大きいの値を指定してください。",
  //         path: ["endTime"],
  //       });
  //     }
  //   });
  // const formArraySchema = z.array(formSchema);

  const [shiftList, setShiftList] = useState<ShiftType[]>([]);
  const [loading, setLoading] = useState(true);
  // const {
  //   register,
  //   getValues,
  //   setValue,
  //   FormState: { errors },
  //   handleSubmit,
  // } = useForm({
  //   defaultValues: defaultData.shiftData,
  //   resolver: zodResolver(formArraySchema),
  // });
  const [shiftData, setShiftData] = useState<ShiftType>(defaultData);

  console.log(shiftData);
  console.log(shiftList);

  //入力フォームに表示するデータをフォーマットに挿入
  useEffect(() => {
    setLoading(true);
    fetch(`/api/shift/targetDate/${targetDate}`)
      .then((res) => res.json())
      .then((data) => {
        setShiftList(data);

        // userId に一致するシフトを探す
        const userShift = data.find((t: ShiftType) => t.userId === userId);

        // shiftData を更新
        setShiftData(() => ({
          ...defaultData,
          userId,
          name,
          shiftData: defaultData.shiftData.map((s) => {
            const matchingShift = userShift?.shiftData.find(
              (t: { shiftDate: Date }) => {
                const tDate = new Date(t.shiftDate);
                const sDate = new Date(s.shiftDate);
                return (
                  tDate.getFullYear() === sDate.getFullYear() &&
                  tDate.getMonth() === sDate.getMonth() &&
                  tDate.getDate() === sDate.getDate()
                );
              }
            );

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
      })
      .finally(() => setLoading(false));
  }, [defaultData, name, targetDate, userId]);

  // DBに登録
  const onSave = async (shift: ShiftType) => {
    //　空のデータは省いて整理しない
    const newShift = {
      ...shift,
      shiftData: shift.shiftData
        // .filter((s) => {
        //   if (!s.shiftDate) return false;
        //   const dateStr =
        //     s.shiftDate instanceof Date
        //       ? s.shiftDate.toISOString().slice(0, 7)
        //       : String(s.shiftDate).slice(0, 7);
        //   return (
        //     dateStr === targetDate && ((s.startTime && s.endTime) || s.status) //時間またはステータスが入っているものだけを残す
        //   );
        // })
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
    <dialog id="editShift" className="modal overflow-y-auto md:p-5">
      {loading && <p>Loading...</p>}

      <form className="w-2/3 h-120 bg-blue-300 p-1  rounded-lg">
        <h2 className="my-5 text-xl md:text-4xl font-bold text-center">
          {shiftData.name}
        </h2>
        <div className="ml-20 h-80 overflow-y-auto">
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
                              Number(e.target.value) !== 1
                                ? ""
                                : shift.startTime,
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
                      i === index
                        ? { ...shift, startTime: newStartTime }
                        : shift
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
                  <option
                    key={i + 1}
                    value={i + 1}
                    disabled={
                      s.endTime !== null &&
                      parseTime(i + 1 + ":00") >= parseTime(s.endTime)
                    }
                  >
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
                  <option
                    key={i + 1}
                    value={i + 1}
                    disabled={
                      s.endTime !== null &&
                      parseTime(i + 1 + ":00") <= parseTime(s.startTime)
                    }
                  >
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
          <button
            className="btn btn-primary"
            onClick={async () => {
              await onSave(shiftData);
              onSaveButtonClick(targetDate);
              (
                document.getElementById("editShift") as HTMLDialogElement
              ).close();
            }}
          >
            Save
          </button>
          <button
            type="button"
            className="ml-5 btn btn-primary bg-gray-600 border-gray-600"
            onClick={() => {
              console.log(shiftData);
              (
                document.getElementById("editShift") as HTMLDialogElement
              ).close();
            }}
          >
            Back
          </button>
        </div>
      </form>
    </dialog>
  );
};
