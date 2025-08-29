import { useState, useTransition } from "react";
import { ReviewType, ReviewRecType } from "@/app/types/type";
import Image from "next/image";
import { Player } from "@lottiefiles/react-lottie-player";
import { useSessionStorage } from "@/app/hooks/useSessionStorage";
import { CircleX } from "lucide-react";
import { Product } from "@/app/types/type";
import { CategoryImages, renderStarRating } from "@/app/lib/utils";

interface AddReviewDialogProps {
  product: Product;
  onClose: () => void;
  setProductReviewDatas: React.Dispatch<React.SetStateAction<ReviewType[]>>;
}

export const AddReviewDialog: React.FC<AddReviewDialogProps> = ({
  product,
  onClose,
  setProductReviewDatas,
}) => {
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [comment, setComment] = useState("");

  const productId = product.id;
  const productName = product.name;

  // ユーザーIDをセッションストレージから取得
  const userId = useSessionStorage("staffId", "0");

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

  const handleAdd = () => {
    const review: ReviewRecType = {
      productId: productId,
      star: 3,
      comment: comment,
      userId: userId,
    };
    startTransition(() => {
      setLoading(true);
      onSave(review);
    });
    fetch(`/api/review/${productId}`)
      .then((res) => res.json())
      .then((data) => setProductReviewDatas(data))
      .then(onClose)
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center" />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white w-[100%] lg:w-[700px] p-6 lg:p-8 flex flex-col lg:flex-row rounded-2xl relative overflow-auto">
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
                  src={`${CategoryImages(String(product.category))}`}
                  alt="商品画像"
                  width={250}
                  height={100}
                  className="rounded-xl"
                />
              </div>

              <div className="flex flex-col">
                <h2 className="text-2xl font-bold">{productName}</h2>

                {/* レビュー入力 */}
                <div className="mt-1 mb-15">
                  <div className="flex flex-col gap-4 mt-2">
                    {/* 星 */}
                    <div>{renderStarRating(3)}</div>

                    {/* コメント */}
                    <textarea
                      className="textarea textarea-bordered  mx-5 w-full h-23 resize"
                      placeholder="write review"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  className="btn btn-outline btn-secondary px-12 "
                  disabled={isPending}
                  onClick={() => {
                    handleAdd();
                    console.log(isPending);
                  }}
                >
                  add
                </button>
                {isPending && (
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
                )}
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
