"use client";
import React from "react";
import { BadgeAlert } from "lucide-react";

export const Setting = () => {
  return (
    <main>
      <h1 className="text-xl">Settings Account</h1>
      <div className="flex flex-row">
        <BadgeAlert className="mt-[11px]" />
        <p className="leading-[50px] ">
          Click on the items shown below to enter your account information.
        </p>
      </div>
    </main>
  );
};
