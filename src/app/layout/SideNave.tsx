"use client";
import Link from "next/link";
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
} from "lucide-react";
import Image from "next/image";
import { Loading } from "../components/Loading";

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
      <div className="flex h-full flex-col px-3 py-4 md:px-2">
        <Link
          className="mb-2 flex h-20 items-end justify-start rounded-md bg-cyan-100 p-4 md:h-40"
          href="/"
        >
          <Image src="/yubi.png" alt="Description" width={100} height={100} />
        </Link>
        <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
          <NavLinks onNavigate={handleNavigation} />
          <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
          <button
            onClick={() => handleNavigation("/")}
            className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <div className="hidden md:block">Sign Out</div>
          </button>
        </div>
      </div>
    </>
  );
};
export default SideNav;
