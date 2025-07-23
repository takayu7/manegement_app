"use client";
import { useEffect, useReducer, useState } from "react";
import { loginData } from "../sampleDate/loginData";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

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
  useEffect(() => {
    if (state.id && state.password) {
      setIsInputChecked(false);
    } else {
      setIsInputChecked(true);
    }
  }, [state.id, state.password]);

  //ログインダイヤログでcancelボタンが押されたときの処理
  function loginCanceled() {
    dispatch({ type: "RESET" });
    setShowPassword(false);
  }

  const [loginError, setLoginError] = useState(false);
  //ユーザーの入力値が予め登録されている情報と一致しているかを確認する処理
  function checkError(id: string, password: string) {
    loginData.map((staff) => {
      if (id == staff.id && password == staff.password) {
        const staffQuery = `?staff=${encodeURIComponent(staff.staffImage)}`;
        router.push(`/top${staffQuery}`);
      } else {
        setLoginError(true);
      }
    });
  }

  return (
      <dialog id="loginDiaLog" className="modal">
        <div className="modal-box bg-stone-700/80 w-[360px] h-[280px]">
          <h2 className="text-[#76F6CE] text-[24px] font-bold text-center leading-[120%]">
            login
          </h2>
          <p className="py-5 text-gray-50">Please enter your ID and password to log in</p>
          <div className="relative mt-[-10px]">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <div className="flex flex-col gap-2">
                <input
                  className="mx-auto m-3 bg-[#FFFFFF]
                     rounded-[4px] w-[250px] h-[27px]"
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
                    dispatch({
                      type: "SET_PASSWORD",
                      payload: e.target.value,
                    });
                    setPassword(e.target.value);
                  }}
                  placeholder="PASS WORD"
                />
                {showPassword ? (
                  <Eye
                    width={25}
                    height={25}
                    className="absolute top-[52px] left-[218px]"
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
                className="btn rounded-[4px] bg-[#FFFFFF] w-[103px] h-[28px] absolute right-[180px] top-[110px]"
                onClick={loginCanceled}
              >
                <span className="text-[#999999]">cancel</span>
              </button>
            </form>
            <button
              className="btn bg-[#CFF7D3] rounded-[4px]  w-[103px] h-[28px] absolute left-[180px] top-[110px]"
              disabled={isInputChecked} // 入力が未チェックの場合はボタンを無効化
              onClick={() => {
                checkError(state.id, state.password);
                if (loginError) {
                  (
                    document.getElementById(
                      "showErrorMessage"
                    ) as HTMLDialogElement
                  )?.showModal();
                  setLoginError(false);
                }
              }}
            >
              <span className="text-[#999999]">log in</span>
            </button>
          </div>
        </div>
      </dialog>
  );
}
