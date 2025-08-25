
import React from "react";
import { TopCarousel } from "@/app/components/customerTop/Carousel";
import { SalesRanking }from "@/app/components/customerTop/SalesRanking";
import {StarRanking} from "@/app/components/customerTop/StarRanking";

export default async function Page() {
  return (
    <>
      <div className="space-y-6">
        <h1 className="mb-10 text-xl md:text-4xl font-bold ">TOP</h1>
        <div className="flex justify-center ">
          <TopCarousel />
        </div>
        <div>
          <SalesRanking />
        </div>
        <div className="flex justify-center">
          <StarRanking />
        </div>
      </div>
    </>
  );
}
