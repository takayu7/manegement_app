"use client";
import { useEffect, useReducer, useState } from "react";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { User } from "@/app/types/type";
import { Loading } from "@/app/components/Loading";

// 状態型（State）
type FormState = {
  id: string;
  password: string;
};

// アクション型（Action）
type Action =
  | { type: "SET_ID"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "RESET" };

// reducer関数
function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case "SET_ID":
      return { ...state, id: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "RESET":
      return { id: "", password: "" };
    default:
      return state;
  }
}

export default function LoginDialog() {
  const [state, dispatch] = useReducer(reducer, {
    id: "",
    password: "",
  });
  const router = useRouter();
  const [, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isInputChecked, setIsInputChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // ← ローディング状態追加
  const [loginError, setLoginError] = useState(false);
  const [userImfomation, setUserInfomation] = useState<User[]>([]);
  useEffect(() => {
    if (state.id && state.password) {
      setIsInputChecked(false);
    } else {
      setIsInputChecked(true);
    }
  }, [state.id, state.password]);

  function loginCanceled() {
    dispatch({ type: "RESET" });
    setShowPassword(false);
    (document.getElementById("LoginDialog") as HTMLDialogElement).close();
  }

  async function handleLogin() {
    await checkError(state.id, state.password);
    if (loginError) {
      (
        document.getElementById("showErrorMessage") as HTMLDialogElement
      )?.showModal();
      setLoginError(false);
    }
  }

  const fetchData = async () => {
    try {
      const userDataList = await fetch("/api/users");
      const json = await userDataList.json();
      setUserInfomation(json);
    } catch (error) {
      console.error("ユーザーデータの取得に失敗:", error);
    } finally {
      setIsLoading(false); // ← データ取得後ローディングを解除
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  async function checkError(id: string, password: string) {
    setIsLoading(true); // ← ログイン中にローディングを表示
    let matched = false;

    for (const staff of userImfomation) {
      if (id === staff.id && password === staff.password) {
        matched = true;
        if (typeof window !== "undefined") {
          sessionStorage.setItem("staffIcon", String(staff.icon));
          sessionStorage.setItem("userName", staff.name);
          sessionStorage.setItem("staffId", staff.id);
        }
        if (staff.id.startsWith("c")) {
          router.push("/customerTop");
        } else {
          router.push("/top");
        }
        return;
      }
    }

    setIsLoading(false); // ← マッチしなかった場合のみ false に戻す
    if (!matched) {
      setLoginError(true);
    }
  }

  // ローディング中はスピナーを表示
  if (isLoading) return <Loading />;

  return (
    <dialog id="LoginDialog" className="modal">
      <div className="modal-box bg-stone-700/80 w-[360px] h-[280px]">
        <h2 className="text-[#76F6CE] text-[24px] font-bold text-center leading-[120%]">
          login
        </h2>
        <p className="py-5 text-gray-50">
          Please enter your ID and password to log in
        </p>
        <div
          onKeyDown={
            !isInputChecked
              ? async (e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }
              : undefined
          }
          className="relative mt-[-10px]"
        >
          <form>
            {/* if there is a button in form, it will close the modal */}
            <div className="flex flex-col gap-2">
              <input
                className="mx-auto m-3 bg-[#FFFFFF] rounded-[4px] w-[250px] h-[27px]"
                type="text"
                value={state.id}
                onChange={(e) =>
                  dispatch({ type: "SET_ID", payload: e.target.value })
                }
                placeholder="ID"
              />
              <input
                className="mx-auto mb-3 bg-[#FFFFFF] rounded-[4px] p-1 w-[250px] h-[27px]"
                type={showPassword ? "text" : "password"}
                value={state.password}
                onChange={(e) => {
                  dispatch({ type: "SET_PASSWORD", payload: e.target.value });
                  setPassword(e.target.value);
                }}
                placeholder="PASS WORD"
              />
              {showPassword ? (
                <Eye
                  width={25}
                  height={25}
                  className="absolute top-[60px] left-[240px]"
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              ) : (
                <EyeOff
                  width={25}
                  height={25}
                  className="absolute top-[60px] left-[240px]"
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              )}
            </div>
            <button
              type="button"
              className="btn rounded-[4px] bg-[#FFFFFF] w-[103px] h-[28px] absolute right-[180px] top-[110px]"
              onClick={loginCanceled}
            >
              <span className="text-[#999999]">cancel</span>
            </button>
          </form>
          <button
            type="button"
            className="btn bg-[#7af7d1] rounded-[4px] border-0  w-[103px] h-[28px] absolute left-[180px] top-[110px]"
            disabled={isInputChecked}
            onClick={async () => {
              handleLogin();
            }}
          >
            <span className="text-[#797979]">log in</span>
          </button>
        </div>
      </div>
    </dialog>
  );
}
