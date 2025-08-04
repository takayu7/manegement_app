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

const ProductTable = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productDatas, setProductDatas] = useState<Product[]>([]);
  const [isPending, startTransition] = useTransition();
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  // ローディング状態
  const [loading, setLoading] = useState(true);

  // 商品データの取得
  useEffect(() => {
    fetch(`/api/products`)
      .then((res) => res.json())
      .then((data) => setProductDatas(data))
      .finally(() => setLoading(false));
  }, []);
  //仕入れ情報の取得
  async function fetchSuppliers() {
    const data = await fetch("/api/suppliers");
    const suppliers = await data.json();
    setSupplierList(suppliers);
  }
  //カテゴリ情報の取得
  async function fetchCategory() {
    const data = await fetch("/api/categories");
    const categories = await data.json();
    setCategoryList(categories);
  }

  useEffect(() => {
    fetchSuppliers();
    fetchCategory();
  }, []);

  // 商品情報の更新
  const onSave = async (product: Product) => {
    console.log(product)
    const resProducts = await fetch("/api/products", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
      cache: "no-store",
    });
    const responseText = await resProducts.text();
    console.log("Response text:", responseText);
    // 商品一覧を再取得してstateを更新
    const updated = await fetch("/api/products");
    const updatedData = await updated.json();
    setProductDatas(updatedData);
  };

  // 商品情報の削除
  const onDelete = async (productId: string) => {
    const resProducts = await fetch("/api/products", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: productId }),
      cache: "no-store",
    });
    const responseText = await resProducts.text();
    console.log("Response text:", responseText);
    // 商品一覧を再取得してstateを更新
    const updated = await fetch("/api/products");
    const updatedData = await updated.json();
    setProductDatas(updatedData);
  };

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
      {/* アニメーション */}
      {loading ? (
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
      ) : (
        <table className="table">
          {/* head */}
          <thead>
            <tr className="grid grid-cols-4 lg:table-row lg:grid-cols-none">
              {headerNames.map((headerName, index) => (
                <th
                  key={index}
                  className={` ${index > 7 ? "lg:text-center lg:px-1" : ""}`}
                >
                  {headerName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productDatas.map((product, index) => (
              <tr
                key={index}
                className={`grid grid-cols-4 lg:table-row lg:grid-cols-none ${
                  index % 2 == 0 && "bg-gray-100"
                }`}
              >
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
                <td className="px-1 lg:text-center">
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
                <td className="px-1 lg:text-center">
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
                <td className="px-1 lg:text-center">
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
                <td className="px-1 lg:text-center">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      (
                        document.getElementById(
                          "SaleDialog"
                        ) as HTMLDialogElement
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
      )}
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
