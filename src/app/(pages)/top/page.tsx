import Image from "next/image";
import Parameter from "@/app/components/Parameter";

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const staffImage = (searchParams?.staff as string) || "/staff/amy-burns.png";

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-xl">TOP</h1>
        <div>
          <Image
            src={staffImage}
            alt="スタッフ写真"
            width={50}
            height={50}
            className="rounded-lg shadow-md"
          />
          {/* For TSX uncomment the commented types below */}
        </div>
        <div>
          <Parameter />
        </div>
      </div>
    </>
  );
}
