"use client";
import React, { useState, useEffect, useTransition } from "react";
import { User } from "@/app/types/type";
import { SquarePen, Trash2 } from "lucide-react";
import { Player } from "@lottiefiles/react-lottie-player";
import { UserEditDialog } from "@/app/components/setting/UserEditDialog";
import { DeleteUserDialog } from "@/app/components/setting/DeleteUserDialog";

export interface RegisterUserProps {
  userDataList: User[];
  onSave: (user: User) => void;
  onDelete: (user: string) => void;
}

export const ShowUserInfomation: React.FC<RegisterUserProps> = ({
  userDataList,
  onSave,
  onDelete,
}) => {
  const [userData, setUserData] = useState<User[]>(userDataList);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  //ユーザー情報の取得
  async function fetchUserData() {
    const data = await fetch("/api/users");
    const users = await data.json();
    setUserData(users);
    console.log(users);
  }

  //ユーザー情報を削除する処理
  // const handleDelete = async (userId: string) => {
  //   const response = await fetch("/api/deleteUser", {
  //     method: "POST",
  //     headers: {
  //       "Context-Type": "application/json",
  //     },
  //     body: JSON.stringify({ userId }),
  //   });
  //   fetchUserData();
  //   const result = await response.json();
  //   if (result.success) {
  //     alert("Deletion successful！");
  //   } else {
  //     alert("Delete failed...");
  //   }
  // };

  // //ユーザー情報を削除するかどうかの確認をする処理
  // const showDeleteConfirmation = async (userId: string) => {
  //   const approval = confirm("Do you want to delete the user?");
  //   if (approval) {
  //     startTransition(() => {
  //       handleDelete(userId);
  //     });
  //   }
  // };

  // 編集ダイアログの保存処理
  const handleSave = (user: User) => {
    startTransition(() => {
      onSave(user); // サーバーアクションを呼ぶ
    });
  };

  // 削除ダイアログの保存処理
  const handleDelete = (id: string) => {
    startTransition(() => {
      onDelete(id); // サーバーアクションを呼ぶ
    });
  };

  //セッション情報を取得する処理
  const updateHeaderInfo = () => {
    const userName = sessionStorage.getItem("userName");
    setUserName(userName);
  };

  useEffect(() => {
    fetchUserData();
    updateHeaderInfo();
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
                    disabled={!(userName == "管理者" || userName == data.name)}
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
                  <button
                    disabled={!(userName == "管理者" || userName == data.name)}
                    onClick={() => {
                      setSelectedUser(data);
                      (
                        document.getElementById(
                          "DeleteUserDialog"
                        ) as HTMLDialogElement
                      )?.showModal();
                    }}
                    className="btn btn-ghost rounded-lg"
                  >
                    <Trash2 />
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
      <DeleteUserDialog
        id={selectedUser?.id}
        onDelete={(id: string) => {
          handleDelete(id);
          setSelectedUser(null);
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
