"use client";
import { useSearchParams } from "next/navigation";

export default function Header() {

  const searchParams = useSearchParams();
  const userName = searchParams.get("userName");

  return (
    <div className="flex w-full h-20 items-center justify-between p-4">
      {userName ? (
        <p>ようこそ、{userName} さん！</p>
      ) : (
        <p>ログインしてください</p>
      )}
    </div>
  );
}
