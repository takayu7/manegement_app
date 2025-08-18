import { Product } from "@/app/types/type";
import { useEffect, useState } from "react";
import { ReviewType } from "@/app/types/type";
import Image from "next/image";
import { Player } from "@lottiefiles/react-lottie-player";
import { SelectStaffIcon } from "@/app/lib/utils";
import { CircleX } from "lucide-react";
import { AddReviewDialog } from "@/app/components/product/AddReviewDialog";

interface ReviewDialogProps {
  product: Product;
  onClose: () => void;
  categoryImages: Record<string, string>;
}

export const ReviewDialog: React.FC<ReviewDialogProps> = ({
  product,
  onClose,
  categoryImages,
}) => {
  const [productReviewDatas, setProductReviewDatas] = useState<ReviewType[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);

  const categoryImg = categoryImages[product.category];
  const productId = product.id;
  const productName = product.name;

  // DBからレビュー情報を取得
  useEffect(() => {
    setLoading(true);
    fetch(`/api/review/${productId}`)
      .then((res) => res.json())
      .then((data) => setProductReviewDatas(data))
      .finally(() => setLoading(false));
  }, [productId]);

  // 評価を星に変換
  const renderStarRating = (rating: number) => {
    const array = Array.from({ length: 5 }, (_, i) => i + 1);
    return (
      <div className="rating">
        {array.map((star) => (
          <div
            key={star}
            className="mask mask-star bg-yellow-400"
            aria-label={`${star} star`}
            aria-current={star === rating ? "true" : "false"}
            style={{
              maskSize: "20px",
            }}
          ></div>
        ))}
      </div>
    );
  };



  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
        <div className="bg-white w-[100%] lg:w-[700px] p-6 lg:p-8 flex flex-col lg:flex-row rounded-2xl relative ">
          {/* アニメーション */}
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
                  src={categoryImg}
                  alt="商品画像"
                  width={250}
                  height={100}
                  className="rounded-xl "
                />
              </div>

              <div className="flex flex-col relative pb-5">
                <h2 className="text-2xl font-bold">{productName}</h2>

                {productReviewDatas.length > 0 ? (
                  <div className="relative h-60 overflow-auto mb-5 mt-2">
                    {productReviewDatas.map((product, index) => (
                      <div key={index} className="chat chat-start lg:flex-row ">
                        <div
                          key={index}
                          className="flex items-center chat-bubble gap-1 p-3 pr-9 rounded-2xl bg-pink-50 border border-pink-100 shadow-sm"
                        >
                          <Image
                            src={`${SelectStaffIcon(
                              (product.userIcon || 0).toString()
                            )}`}
                            alt="スタッフアイコン"
                            width={45}
                            height={45}
                            className="rounded-lg shadow-md"
                          />

                          <div className="pl-3">
                            <div className="flex flex-row gap-3">
                              <p className="text-gray-500">
                                {product.userName}
                              </p>
                              <span className="text-sm text-gray-500 ">
                                {product.date
                                  ? new Date(product.date).toLocaleDateString()
                                  : "Unknown"}
                              </span>
                            </div>
                            {renderStarRating(product.star)}
                            <p className="font-bold">{product.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 italic p-10">
                    No Review
                  </p>
                )}
              </div>

              <div className="absolute bottom-5 right-8">
                <button
                  className="btn btn-outline btn-secondary  hover:text-white"
                  onClick={() => setIsAddReviewOpen(true)}
                >
                  add review
                </button>
              </div>

              <div className="">
                <button
                  className="absolute top-4 right-4 btn btn-ghost btn-circle"
                  onClick={onClose}
                >
                  <CircleX className="mr-0.5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {isAddReviewOpen && (
        <AddReviewDialog
          product={product}
          categoryImages={categoryImages}
          onClose={() => setIsAddReviewOpen(false)}
        />
      )}
    </>
  );
};
