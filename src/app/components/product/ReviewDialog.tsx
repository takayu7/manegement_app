import { Product } from "@/app/types/type";
import { useEffect, useState } from "react";
import { ReviewType, ReviewRecType } from "@/app/types/type";
import Image from "next/image";
import { Player } from "@lottiefiles/react-lottie-player";
import { SelectStaffIcon } from "@/app/lib/utils";
import { useSessionStorage } from "@/app/hooks/useSessionStorage";
import { CircleX } from "lucide-react";

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

  const categoryImg = categoryImages[product.category];
  const productId = product.id;
  const productName = product.name;
  // const productId = "a72696";

  // ユーザーIDをセッションストレージから取得
  const userId = useSessionStorage("staffId", "0");

  const testData: ReviewRecType = {
    productId: productId,
    star: 5,
    comment: "Great product!",
    userId: userId,
  };

  // DBからレビュー情報を取得
  useEffect(() => {
    setLoading(true);
    fetch(`/api/review/${productId}`)
      .then((res) => res.json())
      .then((data) => setProductReviewDatas(data))
      .finally(() => setLoading(false));
  }, [productId]);

  // レビュー保存
  const onSave = async (review: ReviewRecType) => {
    const response = await fetch(`/api/review/${review.productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    });
    const responseText = await response.text();
    console.log("Response text:", responseText);
  };

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
      <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center" />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white  w-[100%] lg:w-[700px] p-6 lg:p-8 flex flex-col lg:flex-row rounded-2xl relative overflow-auto">
          {/* <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Review
          </h2> */}
          {/* アニメーション */}
          {loading ? (
            <Player
              autoplay
              loop
              src="/lottie/Loading.json"
              style={{
                height: "100px",
                width: "100px",
              }}
            />
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

              <div className="flex flex-col">
                <h2 className="text-2xl font-bold">{productName}</h2>
                {productReviewDatas.map((product, index) => (
                  <div
                    key={index}
                    className="flex  chat chat-start lg:flex-row"
                  >
                    <div
                      key={index}
                      className="flex items-center chat-bubble gap-1 p-3 pr-6 rounded-2xl bg-pink-50 border border-pink-100 shadow-sm"
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

                      <div>
                        <p className="text-gray-500">{product.userName}</p>
                        {renderStarRating(product.star)}
                        <p className="w-32">{product.comment}</p>
                        <span className="text-sm text-gray-500">
                          {product.date
                            ? new Date(product.date).toLocaleDateString()
                            : "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex items-end mt-4 gap-2">
                  <button
                    className="btn btn-outline btn-secondary absolute bottom-7 right-10 hover:text-white"
                    onClick={() => onSave(testData)}
                  >
                    add review
                  </button>
                  {/* <button className="btn bg-blue-900 hover:bg-blue-800 px-6 py-2 text-white font-semibold rounded-lg" onClick={onClose}>
                    close
                  </button> */}
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
            </>
          )}
        </div>
      </div>
    </>
  );
};
