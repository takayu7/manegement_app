import {
  Sprout,
  Shirt,
  CupSoda,
  Disc,
  GraduationCap,
  Dog,
  Footprints,
} from "lucide-react";

export const categories = (categoryNumber: number) => {
  const iconCss = "flex items-center gap-1";
  const iconSize = "h-7 w-7";
  switch (categoryNumber) {
    case 1:
      return (
        <div className={iconCss}>
          <Sprout className={iconSize} />
        </div>
      );
    case 2:
      return (
        <div className={iconCss}>
          <Shirt className={iconSize} />
        </div>
      );
    case 3:
      return (
        <div className={iconCss}>
          <GraduationCap className={iconSize} />
        </div>
      );
    case 4:
      return (
        <div className={iconCss}>
          <Disc className={iconSize} />
        </div>
      );
    case 5:
      return (
        <div className={iconCss}>
          <CupSoda className={iconSize} />
        </div>
      );
    case 6:
      return (
        <div className={iconCss}>
          <Dog className={iconSize} />
        </div>
      );
    case 7:
      return (
        <div className={iconCss}>
          <Footprints className={iconSize} />
        </div>
      );
    default:
      return "Unknown";
  }
};

//　円表示切り替え関数
const formatCurrency = (amount: number) => {
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toLocaleString("ja-JP", {
    style: "currency",
    currency: "JPY",
  });
  return amount < 0 ? `￥- ${absAmount.toLocaleString("ja-JP")}` : formatted;
};

export const jpMoneyChange = (price: number) => {
  return <div>{formatCurrency(price)}</div>;
};
