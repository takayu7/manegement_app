export const dynamic = "force-dynamic";

import React from "react";
import { TopCarousel } from "@/app/components/customerTop/Carousel";
import { SalesRanking } from "@/app/components/customerTop/SalesRanking";
import { StarRanking } from "@/app/components/customerTop/StarRanking";
import { FavoriteList } from "@/app/components/customerTop/FavoriteList";

export default async function Page() {
  return (
    <>
      <div className="space-y-6">
        <h1 className="mb-10 text-xl md:text-4xl font-bold ">TOP</h1>
        <div className="flex justify-center ">
          <TopCarousel />
        </div>
        <div>
          <h2 className="font-bold">Sales Ranking</h2>
          <SalesRanking />
        </div>
        <div>
          <h2 className="font-bold">Star Ranking</h2>
          <StarRanking />
        </div>
        <div>
          <h2 className="font-bold">Your Favorite</h2>
          <FavoriteList />
        </div>
      </div>
    </>
  );
}
