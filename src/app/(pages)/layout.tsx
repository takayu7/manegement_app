import "@/app/globals.css";
import SideNav from "@/app/layout/SideNave";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex h-screen flex-1 space-x-5">
        <div className="flex-none w-64">
          <SideNav />
        </div>
        <div className="flex-1 rounded-md my-4 bg-white overflow-y-auto p-12">
          {children}
        </div>
      </div>
    </>
  );
}
