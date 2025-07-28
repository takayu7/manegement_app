import "@/app/globals.css";
import SideNav from "@/app/layout/SideNave";
import Header from "@/app/layout/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex h-screen flex-1 space-x-5 p-2 pt-10 md:pl-64">
        <div className="absolute top-0 left-0 z-50 w-full bg-white opacity-80 shadow-md">
          <Header />
        </div>
        <div className="absolute left-7 top-[85px] flex-none lg:w-64">
          <SideNav />
        </div>
        <div className="flex-1 rounded-md mt-32 bg-white overflow-y-auto p-4 md:mt-4 lg:p-12">
          {children}
        </div>
      </div>
    </>
  );
}
