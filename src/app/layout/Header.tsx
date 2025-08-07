"use client";
import { useEffect, useState } from "react";
import { SelectStaffIcon } from "@/app/lib/utils";
import Image from "next/image";
import { Player } from "@lottiefiles/react-lottie-player";

export default function Header() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userIcon, setUserIcon] = useState<string>("0");
  const [angle, setAngle] = useState(0);

  const handleClick = () => {
    setAngle((prev) => prev + 360); // 360度ずつ回転
  };

  // 値の取得処理を関数化
  const updateHeaderInfo = () => {
    const storedName = sessionStorage.getItem("userName");
    const storedIcon = sessionStorage.getItem("staffIcon") || "0";
    setUserName(storedName);
    setUserIcon(storedIcon);
  };

  useEffect(() => {
    updateHeaderInfo();

    // カスタムイベント監視
    const handler = () => updateHeaderInfo();
    window.addEventListener("headerUpdate", handler);

    return () => {
      window.removeEventListener("headerUpdate", handler);
    };
  }, []);

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
      <div
        onClick={handleClick}
        style={{
          display: "inline-block",
          cursor: "pointer",
          transition: "transform 0.5s ease-in-out",
          transform: `rotate(${angle}deg)`,
        }}
      >
        <Player
          autoplay
          loop
          src="/lottie/Lottie_Lego.json"
          style={{ height: "100px", width: "100px" }}
        />
      </div>
    </div>
  );
}
