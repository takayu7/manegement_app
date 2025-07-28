// ファイル名: EditDialog.tsx
"use client";
import { useEffect, useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";

export const CountDown = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  //現在の時間を取得する
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // AM9:30を0、18:00を100とする進捗値
  const startMinutes = 9 * 60 + 30; // 9:30 = 570分
  const endMinutes = 18 * 60; // 18:00 = 1080分
  const nowMinutes = hours * 60 + minutes;
  let worktime = 0;
  if (nowMinutes <= startMinutes) {
    worktime = 0;
  } else if (nowMinutes >= endMinutes) {
    worktime = 100;
  } else {
    worktime =
      ((nowMinutes - startMinutes) / (endMinutes - startMinutes)) * 100;
  }
  worktime = Math.max(0, Math.min(100, worktime));

  //時間帯によってアイコンが変わる処理
  const timeIcon = (hours: number) => {
    if (hours < 12) {
      return "/lottie/Meditation.json";
    } else if (hours < 17) {
      return "/lottie/Working.json";
    } else {
      return "/lottie/Reading.json";
    }
  };

  return (
    <>
      <div className="px-5 rounded-md border space-y-3 border-gray-300 shadow-md py-5 lg:px-10 lg:space-y-0">
        <div className="grid grid-flow-col gap-3 text-center auto-cols-max lg:-mb-5 lg:gap-5">
          <div className="flex flex-col">
            <Player
              autoplay
              loop
              src={timeIcon(hours)}
              style={{
                height:
                  typeof window !== "undefined" && window.innerWidth < 1024
                    ? "0px"
                    : "200px",
                width:
                  typeof window !== "undefined" && window.innerWidth < 1024
                    ? "0px"
                    : "200px",
              }}
            />
          </div>
          <div className="flex flex-col md:pt-10">
            <span className="countdown font-mono text-5xl">
              <span
                style={{ "--value": String(month) } as React.CSSProperties}
              />
            </span>
            month
          </div>
          <div className="flex flex-col md:pt-10">
            <span className="countdown font-mono text-5xl">
              <span
                style={{ "--value": String(date) } as React.CSSProperties}
              />
            </span>
            day
          </div>
          <div className="flex flex-col md:pt-10">
            <span className="countdown font-mono text-5xl">
              <span
                style={{ "--value": String(hours) } as React.CSSProperties}
              />
            </span>
            hours
          </div>
          <div className="flex flex-col md:pt-10">
            <span className="countdown font-mono text-5xl">
              <span
                style={{ "--value": String(minutes) } as React.CSSProperties}
              />
            </span>
            min
          </div>
          <div className="flex flex-col md:pt-10">
            <span className="countdown font-mono text-5xl">
              <span
                style={{ "--value": String(seconds) } as React.CSSProperties}
              />
            </span>
            sec
          </div>
        </div>
        <progress
          className="progress progress-primary w-full"
          value={worktime}
          max="100"
        ></progress>
      </div>
    </>
  );
};
