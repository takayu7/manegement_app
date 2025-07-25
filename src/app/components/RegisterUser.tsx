"use client";
import React, { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { ListPlus } from "lucide-react";
import { User } from "@/app/types/type";
import { IconData } from "../sampleDate/IconData";

export interface RegisterUserProps {
  onSave: (user: User) => void;
}

const defaultData: User = {
  id: "",
  name: "",
  password: "",
  icon: 0,
};

export const RegisterUser: React.FC<RegisterUserProps> = ({ onSave }) => {
  const [addUser, setAddUser] = useState<User>(defaultData);
  const [isPending, startTransition] = useTransition();

  // すべての入力が完了しているか
  const isAllFilled =
    addUser.name !== "" && addUser.password !== "" && addUser.icon > 0;

  // 自動採番（ID）
  function getRandomNumFromServer() {
    const randomNumber = Math.floor(Math.random() * 999999).toString();
    return randomNumber;
  }
  async function automaticNumbering() {
    const data = await fetch("/api/users");
    const users = await data.json();
    let randomNum = getRandomNumFromServer();
    const existingIds = new Set(users.map((user: { id: string }) => user.id));
    while (existingIds.has(randomNum)) {
      randomNum = getRandomNumFromServer();
    }
    const id = randomNum;
    setAddUser({ ...addUser, id: id });
  }
  useEffect(() => {
    automaticNumbering();
  }, []);

  //addボタン
  const handleAdd = () => {
    const result = confirm("登録しますか？");
    if (result) {
      console.log("ID : " + addUser.id);
      console.log(addUser);
      startTransition(() => {
        onSave(addUser);
      });
      setAddUser(defaultData);
    }
  };

  //ラジオボタンのチェックを外す処理
  const [selectedValue, setSelectedValue] = useState(0);
  const clearRadioSelection = () => {
    setSelectedValue(0);
  };

  return (
    <>
      <div>
        {/* Name */}
        <div className="mb-[10px]">
          NAME：　
          <input
            type="text"
            id="name"
            name="name"
            value={addUser.name}
            onChange={(e) => setAddUser({ ...addUser, name: e.target.value })}
            placeholder="input"
            className="input input-bordered text-black"
          />
        </div>
        {/* Password */}
        <div className="mb-[20px]">
          PW： 　　
          <input
            type="text"
            id="password"
            name="password"
            value={addUser.password}
            onChange={(e) =>
              setAddUser({ ...addUser, password: e.target.value })
            }
            placeholder="password"
            className="input input-bordered text-black"
          />
        </div>
        {/* Icon */}
        <div className="flex flex-col">
          <p>Please select one icon</p>
          <div className="flex flex-row">
            {IconData.map((icon) => (
              <label key={icon.id} className="mr-[20px]">
                <input
                  type="radio"
                  value={icon.id}
                  name="icon"
                  checked={selectedValue == icon.id}
                  onChange={(e) => {
                    setAddUser({
                      ...addUser,
                      icon: Number(e.target.value),
                    });
                    setSelectedValue(Number(e.target.value));
                  }}
                />
                <Image
                  src={icon.staffImage}
                  alt={icon.name}
                  width={100}
                  height={100}
                />
              </label>
            ))}
          </div>
        </div>
        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isAllFilled}
            onClick={() => {
              handleAdd();
              clearRadioSelection();
            }}
          >
            <ListPlus />
            登録
          </button>
        </div>
        {isPending && <span className="text-rose-500 text-end">update...</span>}
      </div>
    </>
  );
};
