import React from "react";
import { Setting } from "@/app/components/setting/Setting";
import { CollapseUser } from "@/app/components/setting/CollapseUser";
import { CollapseSupplier } from "@/app/components/setting/CollapseSupplier";

export default function Page() {
  return (
    <>
      <Setting />
      <CollapseUser />
      <CollapseSupplier />
    </>
  );
}
