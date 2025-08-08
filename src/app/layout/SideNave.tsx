"use client";
import clsx from "clsx";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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

const links = [
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

const NavLinks = ({ onNavigate }: { onNavigate: (href: string) => void }) => {
  const pathname = usePathname(); //現在のパスを取得

  return (
    <>
      {links.map((link) => {
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
            <p className="hidden md:block">{link.name}</p>
          </button>
        );
      })}
    </>
  );
};

const LoginDialog = dynamic(() => import("@/app/components/loginDialog"), {
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
      <div className="flex h-full flex-col py-4 md:px-2">
        <button
          className="btn mb-2 h-0 items-center justify-center rounded-md md:h-20 relative overflow-hidden p-0 hidden md:flex"
          onClick={() =>
            (
              document.getElementById("loginDiaLog") as HTMLDialogElement
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
        <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
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
      {/* ログインダイヤログ*/}
      <LoginDialog />
      {/* エラーメッセージダイヤログ*/}
      <ErrorMessageDiaolog />
    </>
  );
};
export default SideNav;
