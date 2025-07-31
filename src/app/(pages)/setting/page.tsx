import React from "react";
import { Setting } from "@/app/components/Setting";
import { CollapseUser } from "@/app/components/CollapseUser";
import { CollapseSupplier } from "@/app/components/CollapseSupplier";

export default function Page() {
  return (
    <>
      <Setting />
      <CollapseUser />
      <CollapseSupplier />
    </>
  );
}
