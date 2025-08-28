"use client";

import { useEffect, useState } from "react";
import { ShiftMessage } from "./ShiftMessage";
import { ShiftMessageForAdmin } from "./ShiftMessageForAdmin";

export const ParentCompForShift = () => {
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const userId = sessionStorage.getItem("staffId") || "0";
    setUserId(() => userId);
  }, []);
  return (
    <>{userId === "admin" ? <ShiftMessageForAdmin /> : <ShiftMessage />}</>
  );
};
