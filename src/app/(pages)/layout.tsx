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
      <div className="flex h-screen flex-col md:space-y-5">
        <div className=" z-50 w-full bg-white opacity-80 shadow-md">
          <Header />
        </div>
        <div className="flex flex-col md:flex-row w-full h-dvh min-h-0 px-10 space-y-3 pb-10 md:space-x-3 md:space-y-0">
          <div className="flex-none md:w-64">
            <SideNav />
          </div>
          <div className="rounded-md flex-1 bg-white min-h-0 overflow-y-auto p-2 lg:p-12">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
