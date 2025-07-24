"use client";
import { useSearchParams } from "next/navigation";
import { SelectStaffIcon } from "@/app/lib/utils";
import Image from "next/image";

export default function Header() {
  const searchParams = useSearchParams();
  const userName = searchParams.get("userName");
  const userIcon = searchParams.get("staff") || "0"; // デフォルトはアイコン1

  return (
    <div className="flex w-full h-20 items-center justify-between py-4 px-10">
      {userName ? (
        <div className="flex items-center gap-4">
          <Image
            src={`${SelectStaffIcon(userIcon)}`}
            alt="スタッフアイコン"
            width={50}
            height={50}
            className="rounded-lg shadow-md"
          />
          <span className="text-lg font-semibold">{userName}</span>
        </div>
      ) : (
        <p>ログインしてください</p>
      )}
    </div>
  );
}
