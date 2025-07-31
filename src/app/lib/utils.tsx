import {
  Sprout,
  Shirt,
  CupSoda,
  Disc,
  GraduationCap,
  Dog,
  Footprints,
} from "lucide-react";

// カテゴリアイコンを返す関数
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
  return formatCurrency(price);
};

//userIconIDを元にアイコンを返す
export const SelectStaffIcon = (iconId: string) => {
  switch (iconId) {
    case "1":
      return "/staff/amy-burns.png";
    case "2":
      return "/staff/balazs-orban.png";
    case "3":
      return "/staff/delba-de-oliveira.png";
    case "4":
      return "/staff/junping-bullfighting.png";
    case "5":
      return "/staff/lee-robinson.png";
    case "6":
      return "/staff/squirrel.png";
    default:
      return "/staff/amy-burns.png"; // デフォルトのアイコン
  }
};

// 今日の日付とdeadlineの日付を見比べ値を返す
export function compareDeadline(deadline: Date | null): 0 | 1 | 2 {
  const today = new Date();
  const tY = today.getFullYear(),
    tM = today.getMonth(),
    tD = today.getDate();
  const dY = deadline?.getFullYear(),
    dM = deadline?.getMonth(),
    dD = deadline?.getDate();

  if (dY === tY && dM === tM && dD === tD) return 1; // 今日
  if (deadline && deadline < new Date(tY, tM, tD)) return 2; // 期限切れ
  return 0; // まだ
}

// 値に応じて背景色を返す
export function todoBgColor(deadline: Date | null, checked: Date | null) {
  const compare = compareDeadline(deadline);
  if (checked) {
    return "bg-gray-200"; // チェック済み
  } else if (compare === 1) {
    return "bg-emerald-50"; // 今日
  } else if (compare === 2) {
    return "bg-rose-200"; // 期限切れ
  }
  return "";
}

// 年下2桁+月日+ランダム3桁の9桁IDを生成
export function generateCustomId(): string {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const date = `${month}${day}`;
  const random = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return `${year}${date}${random}`;
}
