"use client";
import { useEffect, useState } from "react";

// ユーザーストレージからIDを取得するカスタムフック
export const useSessionStorage = (key: string, defaultValue: string = "0") => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const storedValue = sessionStorage.getItem(key) || defaultValue;
    setValue(storedValue);
  }, [key, defaultValue]);

  return value;
};
