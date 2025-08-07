"use client";
import React, { useState, useEffect, useTransition } from "react";
import { User } from "@/app/types/type";
import { SquarePen, Trash2 } from "lucide-react";
import { Player } from "@lottiefiles/react-lottie-player";
import { UserEditDialog } from "./UserEditDialog";

export interface RegisterUserProps {
  userDataList: User[];
  onSave: (user: User) => void;
}

export const ShowUserInfomation: React.FC<RegisterUserProps> = ({
  userDataList,
  onSave,
}) => {
  const [userData, setUserData] = useState<User[]>(userDataList);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isPending, startTransition] = useTransition();
  //ユーザー情報の取得
  async function fetchUserData() {
    const data = await fetch("/api/users");
    const users = await data.json();
    setUserData(users);
    console.log(users);
  }

  //ユーザー情報を削除する処理
  const handleDelete = async (userId: string) => {
    const response = await fetch("/api/deleteUser", {
      method: "POST",
      headers: {
        "Context-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
    fetchUserData();
    const result = await response.json();
    if (result.success) {
      alert("Deletion successful！");
    } else {
      alert("Delete failed...");
    }
  };

  //ユーザー情報を削除するかどうかの確認をする処理
  const showDeleteConfirmation = async (userId: string) => {
    const approval = confirm("Do you want to delete the user?");
    if (approval) {
      startTransition(() => {
        handleDelete(userId);
      });
    }
  };

  // 編集ダイアログの保存処理
  const handleSave = (user: User) => {
    startTransition(() => {
      onSave(user); // サーバーアクションを呼ぶ
    });
  };

  useEffect(() => {
    fetchUserData();
  }, [userDataList]);

  return (
    <>
      {userData.length != 0 ? (
        <ul className="table p-7 mt-10 lg:mt-0 lg:ml-30 flex flex-col text-black gap-3 bg-[#FAFAFA] rounded-[16px] ">
          {userData.map((data, index) => (
            <li key={index}>
              <div className="flex flex-row justify-between">
                <div>
                  <div>＜ID：{data.id}＞</div>
                  <div>{data.name}</div>
                </div>
                <div className="flex flex-row">
                  <button
                    onClick={() => {
                      {
                        console.log(selectedUser);
                        setSelectedUser(data);
                        (
                          document.getElementById(
                            "UserEditDialog"
                          ) as HTMLDialogElement
                        )?.showModal();
                      }
                    }}
                    className="btn btn-ghost rounded-lg"
                  >
                    <SquarePen />
                  </button>
                  <button className="btn btn-ghost rounded-lg ml-1">
                    <Trash2 onClick={() => showDeleteConfirmation(data.id)} />
                  </button>
                </div>
              </div>
              <hr className="border-gray-400 mb-3" />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="table h-10 p-7 pt-2 lg:ml-30 text-black gap-3 bg-[#FAFAFA] rounded-[16px] ">
          <li className="text-center mb-[-100px] md:mt-5 md:mb-0">
            No Data...
          </li>
        </ul>
      )}
      <UserEditDialog
        user={selectedUser}
        onSave={(user: User) => {
          handleSave(user);
        }}
      />
      {isPending && (
        <Player
          autoplay
          loop
          src="/lottie/Loading.json"
          style={{
            height: "100px",
            width: "100px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </>
  );
};
