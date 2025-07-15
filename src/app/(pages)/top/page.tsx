import Image from "next/image";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const staffImage = searchParams.staff;
  return (
    <>
      <h1 className="text-xl">TOP</h1>
      <div>
        <Image
          src={staffImage}
          alt="スタッフ写真"
          width={50}
          height={50}
          className="rounded-lg shadow-md"
        />
      </div>
    </>
  );
}
