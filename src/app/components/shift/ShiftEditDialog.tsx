"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import React from "react";
import { ShiftType, ShiftDataType } from "@/app/types/type";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Player } from "@lottiefiles/react-lottie-player";

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

  //時間を秒に変換する処理
  const parseTime = (time: string) => {
    const [h, m, s] = time.split(":").map(Number);
    const second = h * 60 + m + s;
    return second;
  };

  //入力フォームのバリデーション
  const shiftDataSchema = z.array(
    z
      .object({
        shiftDate: z.date(),
        startTime: z.string().nullable(),
        endTime: z.string().nullable(),
        status: z.number(),
      })
      .superRefine((data, ctx) => {
        if (data.startTime != null && data.endTime != null) {
          const startTime = parseTime(data.startTime);
          const endTime = parseTime(data.endTime);
          if (startTime >= endTime) {
            ctx.addIssue({
              code: "custom",
              message: "startはendよりも小さい値を選んでください。",
              path: ["startTime"],
            });
          }
        }
      })
  );
  const formSchema = z.object({
    userId: z.string(),
    name: z.string(),
    icon: z.string(),
    shiftData: shiftDataSchema,
  });

  const defaultData = useMemo(() => {
    return {
      userId: "",
      name: "",
      icon: "",
      shiftData: generateMonthShiftData() as ShiftDataType[],
    };
  }, [generateMonthShiftData]);

  const [shiftList, setShiftList] = useState<ShiftType[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    register,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<z.infer<typeof formSchema>>({
    defaultValues: defaultData,
    resolver: zodResolver(formSchema),
  });

  console.log(shiftList);

  //defaultValuesに値を挿入する処理
  useEffect(() => {
    setValue("userId", userId);
    setValue("name", name);
  });

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
        setValue(
          "shiftData",
          defaultData.shiftData.map((s) => {
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
          })
        );
      })
      .finally(() => setLoading(false));
  }, [defaultData.shiftData, setValue, targetDate, userId]);

  // DBに登録
  const onSave = async (shift: ShiftType) => {
    //　空のデータは省いて整理しない
    const newShift = {
      ...shift,
      shiftData: shift.shiftData
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

  //Saveボタンが押された時の処理
  const handleSaveClick = async () => {
    setLoading(true);
    const newShift: ShiftType = getValues();
    await onSave(newShift);
    onSaveButtonClick(targetDate);
    (document.getElementById("editShift") as HTMLDialogElement).close();
    setLoading(false);
  };

  return (
    <dialog id="editShift" className="modal overflow-y-auto md:p-5">
      <form
        onSubmit={handleSubmit(handleSaveClick)}
        className="w-2/3 h-120 bg-blue-300 p-1  rounded-lg"
      >
        <h2 className="my-5 text-xl md:text-4xl font-bold text-center">
          {getValues("name")}
        </h2>
        <div className="ml-20 h-80 overflow-y-auto">
          {watch("shiftData").map((s, index) => (
            <div key={index}>
              <div className="grid grid-cols-7 gap-2 mb-6">
                <p className="my-auto">{s.shiftDate.toLocaleDateString()}</p>

                {/* stuts（ここから）*/}
                <Controller
                  name={`shiftData.${index}.status`}
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      id={`status${index}`}
                      required
                      onChange={(e) => {
                        const newStatus = Number(e.target.value);
                        field.onChange(newStatus);
                        if (newStatus !== 1) {
                          setValue(`shiftData.${index}.startTime`, "");
                          setValue(`shiftData.${index}.endTime`, "");
                        }
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
                  )}
                />
                {/* stuts（ここまで）*/}

                {/* 開始時間（ここから）*/}
                <select
                  {...register(`shiftData.${index}.startTime`)}
                  id={`startTime${index}`}
                  //name={`startTime${index}`}
                  disabled={watch(`shiftData.${index}.status`) != 1}
                  required
                  className={`select rounded-sm border-2 p-1 text-lg border-gray-500 focus:border-pink-500 focus:input-secondary ${
                    watch(`shiftData.${index}.startTime`)
                      ? "select-secondary"
                      : ""
                  }`}
                >
                  <option value="">start</option>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option
                      key={i + 1}
                      value={(i + 1).toString().padStart(2, "0") + ":00:00"}
                    >
                      {i + 1}
                    </option>
                  ))}
                </select>
                {/* 開始時間（ここまで）*/}
                <p className="my-auto">:00</p>
                <p className="my-auto">-</p>

                {/* 終了時間（ここから）*/}
                <select
                  {...register(`shiftData.${index}.endTime`)}
                  id={`endTime${index}`}
                  disabled={watch(`shiftData.${index}.status`) != 1}
                  required
                  className={`select rounded-sm border-2 p-1 text-lg border-gray-500 focus:border-pink-500 focus:input-secondary ${
                    watch(`shiftData.${index}.startTime`)
                      ? "select-secondary"
                      : ""
                  }`}
                >
                  <option value="">end</option>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option
                      key={i + 1}
                      value={(i + 1).toString().padStart(2, "0") + ":00:00"}
                    >
                      {i + 1}
                    </option>
                  ))}
                </select>
                {/* 終了時間（ここまで）*/}
                <p className="my-auto">:00</p>
              </div>
              {errors.shiftData?.[index]?.startTime !== undefined &&
                errors.shiftData?.[index]?.startTime !== null && (
                  <div>
                    <p className="text-red-600 mt-[-24px] ml-[250px]">
                      {errors.shiftData?.[index]?.startTime?.message}
                    </p>
                  </div>
                )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <button type="submit" className="btn btn-primary">
            Save
          </button>
          <button
            type="button"
            className="ml-5 btn btn-primary bg-gray-600 border-gray-600"
            onClick={() => {
              errors.shiftData = undefined;
              (
                document.getElementById("editShift") as HTMLDialogElement
              ).close();
            }}
          >
            Back
          </button>
        </div>
      </form>
      {loading && (
        <Player
          autoplay
          loop
          src="/lottie/Loading.json"
          style={{
            height: "100px",
            width: "100px",
            zIndex: "100px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </dialog>
  );
};
