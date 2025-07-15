"use client";
import { useEffect, useState } from "react";
import { Download, ListRestart, ListPlus } from "lucide-react";

export default function Page() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [supplier, setSupplier] = useState("");
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const [cost, setCost] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);

  const [isInputChecked, setIsInputChecked] = useState(true);

  // 数量 × 単価 = 合計金額
  useEffect(() => {
    setTotal(count * cost);
  }, [count, cost]);

  const handleAdd = () => {
    console.log({
      name,
      category,
      count,
      supplier,
      year,
      month,
      day,
      cost,
      price,
      total,
    });
  };

  const handleReset = () => {
    setName("");
    setCategory("");
    setCount(null);
    setSupplier("");
    setYear(null);
    setMonth(null);
    setDay(null);
    setCost(null);
    setPrice(null);
    setTotal(null);
  };

  useEffect(() => {
    if (
      name &&
      category &&
      count &&
      supplier &&
      year &&
      month &&
      day &&
      cost &&
      price&&
      total
    ) {
      setIsInputChecked(false);
    } else {
      setIsInputChecked(true);
    }
  }, [name, category, count, supplier, year, month, day, cost, price, total]);

  return (
    <main>
      <div className="flex">
      <h1 className="mb-10 text-xl md:text-4xl font-bold"><Download className="inline-block mr-2.5 size-8.5"/>Purchase</h1>
    </div>

      <ul className="text-xl font-medium space-y-15 mb-20">
        <li className="flex items-center gap-4">
          <label className="w-40">name :</label>
          <input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="name"
            className="input rounded-sm mx-5 border-2 p-1 text-lg"
          />
        </li>

        <li className="flex items-center gap-4">
          <label className="w-40">category :</label>
          <select
            id="category"
            name="category"
            value={category}
            required
            onChange={(e) => setCategory(e.target.value)}
            className="select rounded-sm mx-5 border-2 p-1 w-1/5 text-lg"
          >
            <option value="" hidden>
              please select
            </option>
            <option value="服">clothes</option>
            <option value="帽子">cap</option>
            <option value="観葉植物">house plants</option>
            <option value="お皿">plate</option>
            <option value="コップ">cup</option>
            <option value="靴">shooes</option>
            <option value="ペットグッズ">pet goods</option>
          </select>
        </li>

        <li className="flex items-center gap-4">
          <label className="w-40">count：</label>
          <input
            name="count"
            type="text"
            value={count === null ? "" : count}
            onChange={(e) => {
              const v = e.target.value;
              if (/^\d*$/.test(v)) {
                setCount(v === "" ? null : Number(v));
              }
            }}
            placeholder="count"
            className="input rounded-sm mx-5 border-2 p-1 text-lg"
          />
        </li>

        <li className="flex items-center gap-4">
          <label className="w-40">supplier：</label>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                name="supplier"
                value="china"
                checked={supplier === "china"}
                onChange={(e) => setSupplier(e.target.value)}
                className="ml-5 mr-2 radio radio-success"
              />
              China
            </label>
            <label>
              <input
                type="radio"
                name="supplier"
                value="Korea"
                checked={supplier === "Korea"}
                onChange={(e) => setSupplier(e.target.value)}
                className="ml-5 mr-2 radio radio-success"
              />
              Korea
            </label>
            <label>
              <input
                type="radio"
                name="supplier"
                value="NewYork"
                checked={supplier == "NewYork"}
                onChange={(e) => setSupplier(e.target.value)}
                className="ml-5 mr-2 radio radio-success"
              />
              NewYork
            </label>
          </div>
        </li>

        <li className="flex items-center gap-4">
          <label className="w-40">day：</label>

          <div className="flex items-center ">
            <input
              id="year"
              name="year"
              type="text"
              maxLength={4}
              value={year === null ? "" : year}
              onChange={(e) => {
                const v = e.target.value;
                if (/^\d*$/.test(v)) {
                  setYear(v === "" ? null : Number(v));
                }
              }}
              placeholder="year"
              className="input rounded-sm ml-5 mr-1 p-1 w-23 text-lg"
            />
            y
            <input
              id="month"
              name="month"
              type="text"
              maxLength={2}
              value={month === null ? "" : month}
              onChange={(e) => {
                const v = e.target.value;
                if (/^\d*$/.test(v)) {
                  setMonth(v === "" ? null : Number(v));
                }
              }}
              placeholder="month"
              className="input rounded-sm mx-5 mr-1 p-1 w-19 text-lg"
            />
            m
            <input
              id="day"
              name="day"
              type="text"
              maxLength={2}
              value={day === null ? "" : day}
              onChange={(e) => {
                const v = e.target.value;
                if (/^\d*$/.test(v)) {
                  setDay(v === "" ? null : Number(v));
                }
              }}
              placeholder="day"
              className="input rounded-sm mx-5 mr-1 p-1 w-19 text-lg"
            />
            d
          </div>
        </li>

        <li className="flex items-center gap-4">
          <label className="w-40">cost：</label>
          <input
            id="cost"
            name="cost"
            type="text"
            value={cost === null ? "" : cost}
            onChange={(e) => {
              const v = e.target.value;
              if (/^\d*$/.test(v)) {
                setCost(v === "" ? null : Number(v));
              }
            }}
            placeholder="cost"
            className="input rounded-sm mx-5 p-1 text-lg"
          />
        </li>

        <li className="flex items-center gap-4">
          <label className="w-40">price：</label>
          <input
            id="price"
            name="price"
            type="text"
            value={price === null ? "" : price}
            onChange={(e) => {
              const v = e.target.value;
              if (/^\d*$/.test(v)) {
                setPrice(v === "" ? null : Number(v));
              }
            }}
            placeholder="price"
            className="input rounded-sm mx-5 p-1 text-lg"
          />
        </li>

        <li className="flex items-center gap-4">
          <label className="w-40">total：</label>
          <input
            id="total"
            name="total"
            type="number"
            value={total === null ? "" : total}
            readOnly
            data-format="$1 yen"
            className="mx-10 p-1 font-bold mr-1 w-1xl text-1xl"
          />
          yen
        </li>
      </ul>

      <div className="flex gap-3 mt-2 justify-end">
        <button
        
          type="reset"
          className="btn btn-outline btn-xl btn-wide"
          onClick={() => handleReset()}
        ><ListRestart />
          reset
        </button>
        <button
          type="submit"
          disabled={isInputChecked}
          className="btn btn-outline btn-success btn-xl btn-wide"
          onClick={() => handleAdd()}
        ><ListPlus />
          add
        </button>
      </div>
    </main>
  );
}
