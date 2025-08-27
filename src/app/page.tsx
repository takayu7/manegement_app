"use client";
import { Loading } from "@/app/components/Loading";
import dynamic from "next/dynamic";
import React from "react";
import ErrorMessageDiaolog from "@/app/components/errorMessageDiaolog";
import Image from "next/image";

const LoginDialog = dynamic(() => import("@/app/components/LoginDialog"), {
  loading: () => <Loading />,
  ssr: false,
});

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col">
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
          <h1 className="text-[#FAFAFA] px-5 text-[40px] text-center font-serif font-bold mb-[200px] lg:text-[100px]">
            Welcome To
            <br /> Select Shop
          </h1>
          <button
            className="btn btn-outline border-4 border-neutral-200 text-neutral-100 rounded-[4px] w-[240px] h-[48px] absolute bottom-[330px] hover:text-neutral-800 xl:bottom-[200px]"
            onClick={() =>
              (
                document.getElementById("LoginDialog") as HTMLDialogElement
              )?.showModal()
            }
          >
            Log in
          </button>
        </div>
        {/* ログインダイヤログ*/}
        <LoginDialog />
        {/* エラーメッセージダイヤログ*/}
        <ErrorMessageDiaolog />
      </div>
    </main>
  );
}
