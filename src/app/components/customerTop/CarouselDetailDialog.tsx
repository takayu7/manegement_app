//ファイル名:CarouselDetailDialog.tsx
import React from "react";
import Image from "next/image";
import { CircleX } from "lucide-react";
import { Product, ReviewType } from "@/app/types/type";
import {
  renderStarRating,
  jpMoneyChange,
  CategoryImages,
} from "@/app/lib/utils";
import { useEffect, useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";

interface CarouselDetailDialogProps {
  product: Product;
  onClose: () => void;
}

const CarouselDetailDialog: React.FC<CarouselDetailDialogProps> = ({
  product,
  onClose,
}) => {
  const [productReviewDatas, setProductReviewDatas] = useState<ReviewType[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  // const navigate=useNavigate();

  const productId = product.id;

  // DBからレビュー情報を取得
  useEffect(() => {
    setLoading(true);
    fetch(`/api/review/${productId}`)
      .then((res) => res.json())
      .then((data) => setProductReviewDatas(data))
      .finally(() => setLoading(false));
  }, [productId]);

  //総合評価
  const averageStarRating = () => {
    const totalStars = productReviewDatas.reduce(
      (acc, review) => acc + review.star,
      0
    );
    if (productReviewDatas.length === 0) return 0;
    const average = totalStars / productReviewDatas.length;
    return Math.round(average * 10) / 10;
  };

  // const onClick=()=>{
  //   navigate("/product")
  // }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center" />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white w-[100%] lg:w-[700px] p-6 lg:p-8 flex flex-col lg:flex-row rounded-2xl relative">
          {loading ? (
            <div className="mx-auto">
              <Player
                autoplay
                loop
                src="/lottie/Loading.json"
                style={{
                  height: "100px",
                  width: "100px",
                }}
              />
            </div>
          ) : (
            <>
              <div className="flex-shrink-0 inline-block mr-5">
                <Image
                  src={`${CategoryImages(String(product.category))}`}
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
                <div>
                  <p className="mt-4 text-sm">{product.explanation}</p>
                  {productReviewDatas.length > 0 ? (
                    <div className="flex mt-5">
                      {renderStarRating(Math.round(averageStarRating()))}
                      <p className="pl-2">{averageStarRating()}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic mt-5">No Review</p>
                  )}
                </div>
                <button
                  className="absolute top-4 right-4 btn btn-ghost btn-circle"
                  onClick={onClose}
                >
                  <CircleX className="mr-0.5" />
                </button>
                {/* <button onClick={onClick}></button> */}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CarouselDetailDialog;
