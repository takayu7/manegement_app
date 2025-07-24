import { Loading } from "@/app/components/Loading";
import React, { Suspense } from "react";
import Image from "next/image";

export default function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const Parameter = React.lazy(() => import("../../components/Parameter"));

  const staffIcon = (searchParams?.staff as string) || "/staff/amy-burns.png";
  let staffImage;
  if (staffIcon === "1") {
    staffImage = "/staff/amy-burns.png";
  } else if (staffIcon === "2") {
    staffImage = "/staff/balazs-orban.png";
  } else if (staffIcon === "3") {
    staffImage = "/staff/delba-de-oliveira.png";
  } else if (staffIcon === "4") {
    staffImage = "/staff/evil-rabbit.png";
  } else if (staffIcon === "5") {
    staffImage = "/staff/lee-robinson.png";
  } else if (staffIcon === "6") {
    staffImage = "/staff/michael-novotny.png";
  } else {
    staffImage = "/staff/amy-burns.png";
  }
  return (
    <>
      <div className="space-y-6 relative">
        <h1 className="text-xl">TOP</h1>
        <div>
          <Image
            src={staffImage}
            alt="スタッフ写真"
            width={50}
            height={50}
            className="rounded-lg shadow-md"
          />
          {/* For TSX uncomment the commented types below */}
        </div>
        <div>
          <Suspense fallback={<Loading />}>
            <Parameter />
          </Suspense>
        </div>
      </div>
    </>
  );
}
