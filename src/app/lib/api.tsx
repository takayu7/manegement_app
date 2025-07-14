import postgres from "postgres";
import { User } from "@/app/types/type";

const sql = postgres(process.env.POSTGRES_URL!);

export async function fetchUserDatas() {
  try {
    const data = await sql<User[]>`SELECT * FROM users`;

    console.log("data:", data);

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user data.");
  }
}
