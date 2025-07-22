import { Sprout, Shirt, Glasses } from "lucide-react";

export const categories = (categoryNumber: number, categoryName: string) => {
  const iconCss = "flex items-center gap-1";
  const iconSize = "h-3 w-3";
  switch (categoryNumber) {
    case 1:
      return (
        <div className={iconCss}>
          <Sprout className={iconSize} />
          {categoryName}
        </div>
      );
    case 2:
      return (
        <div className={iconCss}>
          <Shirt className={iconSize} />
          {categoryName}
        </div>
      );
    case 3:
      return (
        <div className={iconCss}>
          <Glasses className={iconSize} />
          {categoryName}
        </div>
      );
    default:
      return "Unknown";
  }
};

//　円表示切り替え関数
const formatCurrency = (amount: number) => {
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toLocaleString("ja-JP", { style: "currency", currency: "JPY" });
  return amount < 0 ? `￥- ${absAmount.toLocaleString("ja-JP")}` : formatted;
};

export const jpMoneyChange = (price: number) => {
  return <div>{formatCurrency(price)}</div>;
};
