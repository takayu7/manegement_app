"use client";
import clsx from "clsx";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  House,
  ShoppingCart,
  SquarePen,
  Download,
  Sofa,
  Settings,
  Power,
  ChartNoAxesCombined,
  CalendarCheck2,
} from "lucide-react";
import Image from "next/image";
import { Loading } from "../components/Loading";
import dynamic from "next/dynamic";
import ErrorMessageDiaolog from "@/app/components/errorMessageDiaolog";
import { Menu } from "lucide-react";
import useStore from "@/app/store/useStore";

export type linkType = {
  name: string;
  href: string;
  icon: React.ElementType;
};

const staffLinks: linkType[] = [
  { name: "TOP", href: "/top", icon: House },
  {
    name: "Inventory Management",
    href: "/inventory",
    icon: ShoppingCart,
  },
  {
    name: "Product List",
    href: "/product",
    icon: Sofa,
  },
  {
    name: "Purchase",
    href: "/purchase",
    icon: Download,
  },
  {
    name: "todo",
    href: "/todolist",
    icon: SquarePen,
  },
  {
    name: "dashboard",
    href: "/dashboard",
    icon: ChartNoAxesCombined,
  },
  {
    name: "shift",
    href: "/shift",
    icon: CalendarCheck2,
  },
  {
    name: "Setting",
    href: "/setting",
    icon: Settings,
  },
];

const customerLinks: linkType[] = [
  { name: "TOP", href: "/customerTop", icon: House },
  {
    name: "Product List",
    href: "/product",
    icon: Sofa,
  },
  {
    name: "Cart",
    href: "/cart",
    icon: ShoppingCart,
  },
];

const NavLinks = ({ onNavigate }: { onNavigate: (href: string) => void }) => {
  const [userId, setUserId] = useState<string>("0");
  const pathname = usePathname(); //現在のパスを取得

  const cartItems = useStore((state) => state.cartItem);

  // セッションストレージからユーザーIDを取得して状態を更新する関数
  const updateHeaderInfo = useCallback(() => {
    const storedId = sessionStorage.getItem("staffId") || "0";
    setUserId(storedId);
  }, []);
  //再ログイン時にuserIdの値を更新する
  useEffect(() => {
    updateHeaderInfo();
    const handler = () => updateHeaderInfo();
    window.addEventListener("headerUpdate", handler);
    return () => {
      window.removeEventListener("headerUpdate", handler);
    };
  }, [updateHeaderInfo]);

  return (
    <>
      {userId.startsWith("c")
        ? customerLinks.map((link) => {
            const LinkIcon = link.icon;
            return (
              <button
                key={link.name}
                onClick={() => onNavigate(link.href)}
                className={clsx(
                  "flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 text-left",
                  {
                    "bg-sky-100 text-blue-600": pathname === link.href,
                  }
                )}
              >
                <LinkIcon className="w-6" />
                <p className="">{link.name}</p>
                {cartItems.length > 0 && link.name === "Cart" && (
                  <span className="indicator-item badge badge-primary w-6 h-6 bg-blue-900 rounded-full ">
                    {cartItems.length}
                  </span>
                )}
              </button>
            );
          })
        : staffLinks.map((link) => {
            const LinkIcon = link.icon;
            return (
              <button
                key={link.name}
                onClick={() => onNavigate(link.href)}
                className={clsx(
                  "flex h-[30px] md:h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 text-left",
                  {
                    "bg-sky-100 text-blue-600": pathname === link.href,
                  }
                )}
              >
                <LinkIcon className="w-6" />
                <p className="">{link.name}</p>
              </button>
            );
          })}
    </>
  );
};

const LoginDialog = dynamic(() => import("@/app/components/LoginDialog"), {
  loading: () => <Loading />,
  ssr: false,
});

const SideNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  // ナビゲーション処理
  const handleNavigation = (href: string) => {
    if (href !== pathname) {
      setIsLoading(true);
      router.push(href);
    }
  };

  // pathnameが変わったらローディングを止める
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  return (
    <>
      {isLoading && <Loading />}
      <div className="hidden md:block">
        <button
          className="btn w-full mb-2 rounded-md h-20 relative"
          onClick={() =>
            (
              document.getElementById("LoginDialog") as HTMLDialogElement
            )?.showModal()
          }
        >
          <Image
            src="/logo.png"
            alt="Description"
            width={100}
            height={100}
            className="object-contain"
          />
        </button>
        <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-1">
          <NavLinks onNavigate={handleNavigation} />
          <button
            onClick={() => handleNavigation("/")}
            className="hidden md:flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <Power className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </div>
      </div>
      <div className="drawer drawer-end mt-2 block sm:hidden">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex justify-center">
          {/* Page content here */}
          <label htmlFor="my-drawer" className="btn btn-ghost drawer-button">
            <Menu />
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="menu bg-base-200 text-base-content min-h-full w-80 p-4 mt-24">
            <NavLinks onNavigate={handleNavigation} />
          </div>
        </div>
      </div>
      {/* ログインダイヤログ*/}
      <LoginDialog />
      {/* エラーメッセージダイヤログ*/}
      <ErrorMessageDiaolog />
    </>
  );
};
export default SideNav;
