"use client";
import Link from 'next/link';
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { House,ShoppingCart,SquarePen,Download,Sofa } from 'lucide-react';

const links = [
  { name: "TOP", href: "/top", icon: House },
  {
    name: "sales input",
    href: "/sales",
    icon: ShoppingCart,
  },
    {
    name: "Product list",
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
];

const NavLinks = () => {
  const pathname = usePathname();//現在のパスを取得
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}

const SideNav =()=> {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
export default SideNav;