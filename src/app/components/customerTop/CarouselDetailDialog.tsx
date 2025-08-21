//ファイル名:CarouselDetailDialog.tsx
import React from "react";
import Image from "next/image";
import { Product } from "@/app/types/type";
import {  CircleX } from "lucide-react";
import { jpMoneyChange } from "@/app/lib/utils";

interface CarouselDetailDialogProps {
  product: Product;
  categoryImages: Record<string, string>;
  onClose: () => void;
}

const CarouselDetailDialog: React.FC<CarouselDetailDialogProps> = ({
  product,
  categoryImages,
  onClose,
}) => {
  const categoryImg = categoryImages[product.category];

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center" />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white w-[100%] lg:w-[700px] p-6 lg:p-8 flex flex-col lg:flex-row rounded-2xl relative">
          <div className="flex-shrink-0 inline-block mr-5">
            <Image
              src={categoryImg}
              alt={product.name}
              width={250}
              height={100}
              className="rounded-xl"
            />
          </div>
          <div className="flex flex-col">
            <div className="pb-3 border-b-2">
              <h2 className="text-2xl font-bold">{product.name}</h2>
               <p className="mt-2 text-lg">{jpMoneyChange(product.price)}</p>
            </div>
             <p className="mt-4 text-sm">{product.explanation}</p>
                   
            <button
              className="absolute top-4 right-4 btn btn-ghost btn-circle"
              onClick={onClose}
            >
              <CircleX className="mr-0.5" />
              </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CarouselDetailDialog;
