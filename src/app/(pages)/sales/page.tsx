import { fetchUserDatas } from "@/app/lib/api";

export default async function Page() {
  const userData = await fetchUserDatas();

  return (
    <>
      <h1 className="text-xl">sales</h1>
      <div>
        {userData.map((user) => (
          <div key={user.id}>
            <h2>{user.name}</h2>
            <p>{user.password}</p>
          </div>
        ))}
      </div>
    </>
  );
}
