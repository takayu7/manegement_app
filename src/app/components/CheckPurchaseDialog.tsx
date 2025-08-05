//ファイル名: PurchaseCheckDialog.tsx
"use client";
import { Category, Product, Supplier } from "@/app/types/type";
import { ListPlus, Undo2 } from "lucide-react";
import { Player } from "@lottiefiles/react-lottie-player";

export interface PurchaseCheckDialogProps {
  product: Product;
  categoryList: Category[];
  supplierList: Supplier[];
  onSave: (product: Product) => void;
  onClose: () => void;
}

export const PurchaseCheckDialog: React.FC<PurchaseCheckDialogProps> = ({
  product,
  categoryList,
  supplierList,
  onSave,
  onClose,
}) => {
  const handleAdd = (product: Product) => {
    onSave(product);
  };

  const categoryName = (num: number) => {
    const category = categoryList.find((cat) => cat.id === num);
    return category ? category.name : "Unknown";
  };

  const supplierName = (num: number) => {
    const supplier = supplierList.find((sup) => sup.id === num);
    return supplier ? supplier.name : "Unkown";
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">

      <div className="bg-white p-5 lg:p-8 rounded-2xl w-full max-w-[600px] relative h-110 overflow-y-auto">
        
        <h2 className="text-3xl font-bold mb-3 text-center text-gray-800">
          Check
        </h2>
        <ul className="text-lg font-medium space-y-3 mb-5 text-gray-700">
          {/* 商品名 */}
          <li className="flex lg:flex-row ">
            <label className=" font-semibold text-gray-700 w-40">name：</label>
            <p className="font-bold text-blue-900">{product.name}</p>
          </li>
          {/* カテゴリ */}
          <li className="flex lg:flex-row ">
            <label className=" font-semibold text-gray-700 w-40">
              category:
            </label>
            <p className="font-bold text-blue-900">
              {categoryName(product.category)}
            </p>
          </li>
          {/* 商品説明 */}
          <li className="flex lg:flex-row ">
            <label className=" font-semibold text-gray-700 w-40">
              explanation:
            </label>
            <p className="font-bold text-blue-900">{product.explanation}</p>
          </li>
          {/* 仕入れ数 */}
          <li className="flex lg:flex-row ">
            <label className=" font-semibold text-gray-700 w-40">cost:</label>
            <p className="font-bold text-blue-900">{product.cost}</p>
          </li>
          {/* 仕入れ先 */}
          <li className="flex lg:flex-row ">
            <label className=" font-semibold text-gray-700 w-40">
              supplier:
            </label>
            <p className="font-bold text-blue-900">
              {supplierName(product.supplier)}
            </p>
          </li>

          {/* 原価 */}
          <li className="flex lg:flex-row ">
            <label className=" font-semibold text-gray-700 w-40">count:</label>
            <p className="font-bold text-blue-900">{product.count}</p>
          </li>
          {/* 販売価格 */}
          <li className="flex lg:flex-row ">
            <label className=" font-semibold text-gray-700 w-40">price:</label>
            <p className="font-bold text-blue-900">{product.price}</p>
          </li>
        </ul>

        <div className="flex flex-col lg:flex-row items-center gap-2 relative">
          <div className="absolute -top-64 lg:-top-82 left-30 flex justify-center w-full">
            <div className="relative top-40 left-0 lg:top-[200px] lg:left-[10px] w-[110px] h-[100px] lg:w-[150px] lg:h-[150px]">
         <Player
        autoplay
        loop
        src="/lottie/WalkingElephant.json"

      />
      </div>
      </div>
          <button
            type="submit"
            className="btn bg-pink-400 text-white hover:bg-pink-500 btn-wide btn-lg"
            onClick={() => handleAdd(product)}
          >
            <ListPlus />
            add
          </button>
          <button className="btn btn-wide btn-lg" onClick={onClose}>
            <Undo2 />
            return
          </button>
        </div>
      </div>
    </div>
  );
};
