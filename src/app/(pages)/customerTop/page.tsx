
import React from "react";
import { TopCarousel } from "@/app/components/customerTop/Carousel";

export default async function Page() {
  return (
    <>
      <div className="space-y-6">
        <h1 className="mb-10 text-xl md:text-4xl font-bold ">TOP</h1>
        <div className="bg-red-500 flex justify-center ">
          <TopCarousel />
        </div>
      </div>
    </>
  );
}
