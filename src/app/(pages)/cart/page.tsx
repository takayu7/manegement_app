
import React from "react";
import { CustomerCart } from '@/app/components/cart/CustomerCart';

export default async function Page() {
  return (
    <>
      <div className="space-y-6">
        <h1 className="mb-10 text-xl md:text-4xl font-bold ">Cart</h1>
          <CustomerCart />
      </div>
    </>
  );
}
