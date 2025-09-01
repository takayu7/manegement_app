"use client";
import { ChangeEvent, useEffect, useState } from "react";
import React from "react";
import { ShiftType, User } from "@/app/types/type";
import { ShiftTable } from "@/app/components/shift/ShiftTable";
import { NoPlanShiftTable } from "@/app/components/shift/NoPlanShiftTable";
import z from "zod";
import { formatMessage, MESSAGE_LIST } from "@/app/lib/messages";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShiftEditDialog } from "./ShiftEditDialog";
import { BadgeAlert } from "lucide-react";

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const nowDate = `${year}-${String(month).padStart(2, "0")}`;

type Month = { month: string; value: string };

const defaultValues = {
  name: "",
};

const formSchema = z.object({
  name: z.string().max(20, formatMessage(MESSAGE_LIST.E010106, "20")),
});

export const ShowShift = () => {
  const [months, setMonths] = useState<Month[]>([]);
  const [shiftList, setShiftList] = useState<ShiftType[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [dialogUserName, setDialogUserName] = useState<string>("");
  const [serchedUserName, setSerchedUserName] = useState<string>("");
  const [targetDate, setTargetDate] = useState<string>(nowDate);
  const [loading, setLoading] = useState(true);
  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues, resolver: zodResolver(formSchema) });

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

    // const targetDate = new Date(value);
    // const theLastDate = new Date(
    //   targetDate.getFullYear(),
    //   targetDate.getMonth() + 1,
    //   0
    // );
    // const theLastDay = theLastDate.getDate();

    // const newDays: string[] = [];
    // for (let i = 1; i <= theLastDay; i++) {
    //   newDays.push(i.toString().padStart(2, "0"));
    // }
  };

  // 初回：月リスト生成
  useEffect(() => {
    createMonthList();

    // // 初期状態で days を作成
    // const initDate = new Date(nowDate);
    // const theLastDate = new Date(
    //   initDate.getFullYear(),
    //   initDate.getMonth() + 1,
    //   0
    // );
    // const theLastDay = theLastDate.getDate();

    // const initDays: string[] = [];
    // for (let i = 1; i <= theLastDay; i++) {
    //   initDays.push(i.toString().padStart(2, "0"));
    // }
  }, []);

  //ユーザーを検索する処理
  const searchUser = () => {
    setSerchedUserName(getValues("name"));
  };

  const fetchShift = (targetDate: string) => {
    fetch(`/api/shift/targetDate/${targetDate}`)
      .then((res) => res.json())
      .then((data) => setShiftList(data))
      .finally(() => setLoading(false));
  };
  // targetDate 変更時にシフト取得
  useEffect(() => {
    setLoading(true);
    fetchShift(targetDate);
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

  //serchedUserName 変更時にシフト取得
  useEffect(() => {
    if (serchedUserName !== "") {
      setLoading(true);
      fetch(`/api/targetUserName/${serchedUserName}`)
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .then(() =>
          setUsers((users) => users.filter((user) => !user.id.startsWith("c")))
        )
        .finally(() => setLoading(false));
    }
  }, [serchedUserName]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-80">
          <span className="loading loading-ring loading-xs"></span>
        </div>
      ) : (
        <div>
          <div
            className={`flex ${
              window.innerWidth >= 700 ? "flex-row" : "flex-col gap-3"
            }`}
          >
            {/* 月セレクト */}
            <select
              onChange={handleChange}
              value={targetDate}
              className="h-8 border border-b-black rounded-xs"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.month}
                </option>
              ))}
            </select>

            {/* シフトの検索 */}
            <form
              onSubmit={handleSubmit(searchUser)}
              className={`${
                window.innerWidth < 700 && "ml-[-20px] flex flex-row"
              }`}
            >
              <input
                {...register("name")}
                type="text"
                className="ml-5 h-8 border border-b-black rounded-xs"
                placeholder="検索するユーザーを入力"
              />
              <button type="submit" className="btn btn-primary ml-3 h-8">
                検索
              </button>
              <div className="text-red-300 ml-2">{errors.name?.message}</div>
            </form>
          </div>

          {/* シフト一覧 */}
          <div className="mt-[10px] mb-[-15px] flex flex-row">
            <BadgeAlert className="mt-[12px]" />
            <p className="leading-[50px] ">
              Click on the items shown below to show the shift schedule of
              users.
            </p>
          </div>
          {users.map((user) => {
            const newShiftList = shiftList.find(
              (shift) => shift.userId == user.id
            );
            return (
              <div key={user.id}>
                {newShiftList !== undefined ? (
                  <>
                    <div className="mt-5 bg-base-100 border-base-300 collapse border overflow-x-auto">
                      <input type="checkbox" className="peer" />
                      <div className="px-[16px] collapse-title bg-[#6E6B41] text-[30px] text-primary-content text-center peer-checked:bg-[#d4deda] peer-checked:text-black">
                        {newShiftList.name}
                      </div>
                      <div
                        className="flex flex-col collapse-content lg:flex-row bg-[#6E6B41]
         text-primary-content peer-checked:bg-[#d4deda] peer-checked:text-secondary-content"
                      >
                        <ShiftTable
                          shift={newShiftList}
                          targetDate={targetDate}
                        />
                        <button
                          onClick={() => {
                            setUserId(newShiftList.userId);
                            setDialogUserName(newShiftList.name);
                            (
                              document.getElementById(
                                "editShift"
                              ) as HTMLDialogElement
                            )?.showModal();
                            //console.log(userId);
                          }}
                          className="btn btn-primary ml-5 mb-10  bg-white text-black"
                        >
                          Edit {newShiftList.name}’s Shift
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-5 bg-base-100 border-base-300 collapse border overflow-x-auto">
                      <input type="checkbox" className="peer" />
                      <div className="px-[16px] collapse-title bg-[#6E6B41] text-[30px] text-primary-content text-center peer-checked:bg-[#d4deda] peer-checked:text-black">
                        {user.name}
                      </div>
                      <div
                        className="collapse-content lg:flex-row bg-[#6E6B41]
         text-primary-content peer-checked:bg-[#d4deda] peer-checked:text-secondary-content"
                      >
                        <NoPlanShiftTable user={user} targetDate={targetDate} />
                        <button
                          onClick={() => {
                            setUserId(user.id);
                            setDialogUserName(user.name);
                            (
                              document.getElementById(
                                "editShift"
                              ) as HTMLDialogElement
                            )?.showModal();
                            //console.log(user.id);
                          }}
                          className="btn btn-primary ml-5 mb-10 bg-white text-black"
                        >
                          Edit {user.name}’s Shift
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
          <ShiftEditDialog
            userId={userId}
            name={dialogUserName}
            targetDate={targetDate}
            onSaveButtonClick={fetchShift}
          />
        </div>
      )}
    </>
  );
};
