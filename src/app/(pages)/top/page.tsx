import Image from "next/image";

export default async function Page() {
  const randomNum = Math.floor(Math.random() * 6);
  const staffList =[
    "/staff/amy-burns.png",
    "/staff/balezs-orban.png",
    "/staff/delba-de-oliveira.png",
    "/staff/evil-rabbit.png",
    "/staff/lee-robinson.png",
    "/staff/michael-novotny.png",
  ]

  return (
    <>
      <h1 className="text-xl">TOP</h1>
      <div>
        <Image
          src={staffList[randomNum]}
          alt="スタッフ写真"
          width={50}
          height={50}
          className="rounded-lg shadow-md"
        />
      </div>
    </>
  );
}
