import ProductList from "@/app/components/product/ProductList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default async function ProductListPage() {

  return (
    <div className="p-8">
      <ProductList />
      <ToastContainer />
    </div>
  );
};