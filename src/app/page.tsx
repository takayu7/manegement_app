"use client";
import { useEffect, useReducer, useState } from "react";
import { loginData } from "./sampleDate/loginData";
import Image from "next/image";
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

export default function Page() {
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

  const [loginError, setLoginError] = useState(false);
  function ellorMessage(id: string, password: string) {
    if (id == loginData.id && password == loginData.password) {
      router.push("/top");
    } else {
      setLoginError(true);
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-stone-300">
      <div className="flex items-center justify-center relative">
        <div className="absolute w-full h-full z-0">
          <Image
            src="/top-bg-image.jpg"
            fill
            className="object-cover brightness-50"
            alt="Screenshots of the dashboard project showing desktop version"
          />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <h1 className="text-[#FAFAFA] text-[100px] font-serif font-bold mb-[200px]">
            Wellcome To Select Shop!!
          </h1>
          <button
            className="btn btn-outline border-4 border-neutral-200 text-neutral-100 rounded-[4px] w-[240px] h-[48px] absolute bottom-[330px] hover:text-neutral-800"
            onClick={() =>
              (
                document.getElementById("loginDiaLog") as HTMLDialogElement
              )?.showModal()
            }
          >
            Accent
          </button>
        </div>

        {/* ログインダイヤログ */}
        <dialog id="loginDiaLog" className="modal">
          <div className="modal-box bg-[#999999] w-[290px] h-[263.4px]">
            <h2 className="text-[#76F6CE] text-[24px] font-bold text-center leading-[120%]">
              login
            </h2>
            <p className="py-3 ">Please enter your ID and password to log in</p>
            <div className="relative mt-[-10px]">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <div className="flex flex-col">
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
                    className="mx-auto mb-3 bg-[#FFFFFF] rounded-[4px]  w-[250px] h-[27px]"
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
                    <Image
                      src="/remove-red-eye-outlined.jpg"
                      width={25}
                      height={25}
                      className="absolute top-[55px] left-[220px]"
                      alt="Screenshots of the dashboard project showing desktop version"
                      onClick={() => setShowPassword((prev) => !prev)}
                    />
                  ) : (
                    <Image
                      src="/visibility-off-outlined.jpg"
                      width={27}
                      height={25}
                      className="absolute top-[52px] left-[218px]"
                      alt="Screenshots of the dashboard project showing desktop version"
                      onClick={() => setShowPassword((prev) => !prev)}
                    />
                  )}
                </div>

                <button
                  className="btn rounded-[4px] bg-[#FFFFFF] w-[103px] h-[28px] absolute right-[124.5px] top-[100px]"
                  onClick={() => dispatch({ type: "RESET" })}
                >
                  <span className="text-[#999999]">cancel</span>
                </button>
              </form>
              <button
                className="btn bg-[#CFF7D3] rounded-[4px]  w-[103px] h-[28px] absolute left-[130px] top-[100px]"
                disabled={isInputChecked}
                onClick={() => {
                  ellorMessage(state.id, state.password);
                  if (loginError) {
                    (
                      document.getElementById(
                        "showErrorMessage"
                      ) as HTMLDialogElement
                    )?.showModal();
                  }
                }}
              >
                <span className="text-[#999999]">log in</span>
              </button>
            </div>
          </div>
        </dialog>
        {/* ログインダイヤログ（ここまで）*/}

        {/* エラーメッセージダイヤログ */}
        <dialog id="showErrorMessage" className="modal">
          <div role="alert" className="alert alert-error mb-200 w-[550px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>The ID or password is incorrect.</span>
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn" onClick={() => setLoginError(false)}>
                Close
              </button>
            </form>
          </div>
        </dialog>
        {/* エラーメッセージダイヤログ（ここまで）*/}
      </div>
    </main>
  );
}
