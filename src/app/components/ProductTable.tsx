"use client";
import React, { useState, useEffect, useTransition } from "react";
import { Product, Category, Supplier } from "@/app/types/type";
import { jpMoneyChange } from "@/app/lib/utils";
import { SquarePen, SquarePlus, ShoppingCart, Trash2 } from "lucide-react";
import { ProductEditDialog } from "@/app/components/ProductEditDialog";
import { DeleteDialog } from "@/app/components/DeleteDialog";
import { OrderDialog } from "@/app/components/OrderDialog";
import { SaleDialog } from "@/app/components/SaleDialog";
import { Player } from "@lottiefiles/react-lottie-player";

export interface ProductTableProps {
  productDataList: Product[];
  categoryList: Category[];
  supplierList: Supplier[];
  onSave: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const headerNames: string[] = [
  "Name",
  "Category",
  "Supplier",
  "Count",
  "Cost",
  "Price",
  "TotalCost",
  "TotalPrice",
  "edit",
  "delete",
  "order",
  "sale",
];

const ProductTable: React.FC<ProductTableProps> = ({
  productDataList,
  categoryList,
  supplierList,
  onSave,
  onDelete,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productDatas, setProductDatas] = useState<Product[]>(productDataList);
  const [isPending, startTransition] = useTransition();

  // 編集ダイアログの保存処理
  const handleSave = (product: Product) => {
    startTransition(() => {
      onSave(product); // サーバーアクションを呼ぶ
    });
  };
  // 削除ダイアログの保存処理
  const handleDelete = (productId: string) => {
    startTransition(() => {
      onDelete(productId); // サーバーアクションを呼ぶ
    });
  };

  useEffect(() => {
    setProductDatas(productDataList);
  }, [productDataList]);

  // カテゴリの名前を取得する関数
  const categoryTitleChange = (num: number) => {
    const category = categoryList.find((cat) => cat.id === num);
    return category ? category.name : "Unknown";
  };

  // 仕入れ先の名前を取得する関数
  const supplierTitleChange = (num: number) => {
    const supplier = supplierList.find((sup) => sup.id === num);
    return supplier ? supplier.name : "Unknown";
  };

  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr className="grid grid-cols-4 lg:table-row lg:grid-cols-none">
            {headerNames.map((headerName, index) => (
              <th
                key={index}
                className={` ${index > 7 ? "text-center w-4" : ""}`}
              >
                {headerName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {productDatas.map((product, index) => (
            <tr key={index}  className={`grid grid-cols-4 lg:table-row lg:grid-cols-none ${index % 2 ==0 && "bg-gray-100"}`}>
              <td>{product.name}</td>
              <td>{categoryTitleChange(product.category)}</td>
              <td>{supplierTitleChange(product.supplier)}</td>
              <td>
                {product.count} / {product.order}
              </td>
              <td>{jpMoneyChange(product.cost)}</td>
              <td>{jpMoneyChange(product.price)}</td>
              <td>{jpMoneyChange(product.cost * product.count)}</td>
              <td>{jpMoneyChange(product.price * product.count)}</td>
              <td className="-ml-2 md:ml-0 md:text-center">
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    (
                      document.getElementById(
                        "ProductEditDialog"
                      ) as HTMLDialogElement
                    )?.showModal();
                  }}
                  className="btn btn-ghost rounded-lg"
                >
                  <SquarePen />
                </button>
              </td>
              <td className="-ml-2 md:ml-0 md:text-center">
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    (
                      document.getElementById(
                        "DeleteDialog"
                      ) as HTMLDialogElement
                    )?.showModal();
                  }}
                  className="btn btn-ghost rounded-lg"
                >
                  <Trash2 />
                </button>
              </td>
              <td className="-ml-2 md:ml-0 md:text-center">
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    (
                      document.getElementById(
                        "OrderDialog"
                      ) as HTMLDialogElement
                    )?.showModal();
                  }}
                  className="btn btn-ghost rounded-lg"
                >
                  <SquarePlus />
                </button>
              </td>
              <td className="-ml-2 md:ml-0 md:text-center">
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    (
                      document.getElementById("SaleDialog") as HTMLDialogElement
                    )?.showModal();
                  }}
                  className="btn btn-ghost rounded-lg"
                >
                  <ShoppingCart />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isPending && (
        <Player
          autoplay
          loop
          src="/lottie/Loading.json"
          style={{
            height: "100px",
            width: "100px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
      <ProductEditDialog
        product={selectedProduct}
        categoryList={categoryList}
        supplierList={supplierList}
        onSave={(product: Product) => {
          handleSave(product);
        }}
      />
      <DeleteDialog
        productId={selectedProduct?.id}
        onDelete={(productId: string) => {
          handleDelete(productId);
          setSelectedProduct(null);
        }}
      />
      <OrderDialog
        product={selectedProduct}
        onSave={(product: Product) => {
          handleSave(product);
        }}
      />
      <SaleDialog
        product={selectedProduct}
        onSave={(product: Product) => {
          handleSave(product);
        }}
      />
    </div>
  );
};

export default ProductTable;
