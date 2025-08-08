"use client";
import React from "react";
import { ShowShift } from "@/app/components/shift/ShowShift";

export default function Page() {
  return (
    <>
      <div className="space-y-6">
        <h1 className="text-xl">Shift</h1>
        <ShowShift />
      </div>
    </>
  );
}
