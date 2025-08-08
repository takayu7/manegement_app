//ファイル名：DetailDialog.tsx
import React from "react";
import Image from "next/image";
import { Product } from "@/app/types/type";
import { Plus, Minus, CircleX } from "lucide-react";
import { ShoppingCart } from "lucide-react";

interface DetailDialogProps {
  product: Product;
  buyProduct: number;
  categoryImages: Record<string, string>;
  setBuyProductId: React.Dispatch<
    React.SetStateAction<{ [id: string]: number }>
  >;
  onAdd: () => void;
  onClose: () => void;
}

const DetailDialog: React.FC<DetailDialogProps> = ({
  product,
  buyProduct,
  categoryImages,
  setBuyProductId,
  onAdd,
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
            <div className="mb-5">
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <p className="mt-4 text-sm">{product.explanation}</p>
            </div>

            <div className="mb-5">
              <p className="mt-2">price: {product.price}</p>
              <p className="mt-2">
                stock:
                {product.count > 0 ? (
                  product.count
                ) : (
                  <span className="text-red-600">sold out</span>
                )}
              </p>
            </div>

            <div className="flex items-end mt-4">
              <label className="mt-2">buy:</label>
              <label>{buyProduct}</label>
              <div className="flex items-center gap-4 ml-6">
                <button
                  className="btn btn-outline btn-error"
                  onClick={() => {
                    setBuyProductId((prev) => ({
                      ...prev,
                      [product.id]: buyProduct - 1,
                    }));
                  }}
                  disabled={buyProduct <= 0}
                >
                  <Minus />
                </button>
                <button
                  className="btn btn-outline btn-success"
                  onClick={() => {
                    setBuyProductId((prev) => ({
                      ...prev,
                      [product.id]: buyProduct + 1,
                    }));
                  }}
                  disabled={product.count <= 0 || product.count <= buyProduct}
                >
                  <Plus />
                </button>
              </div>
            </div>

            <div className="flex items-end mt-4">
              <button
                className="btn btn-outline btn-secondary btn-lg absolute bottom-7 right-10 hover:text-white"
                onClick={onAdd}
                disabled={buyProduct < 1}
              >
                <ShoppingCart className="mr-0.5" />
                cart
              </button>
            </div>
          </div>

          <div className="">
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

export default DetailDialog;
