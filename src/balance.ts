// balance.ts
import { db, connectDB } from "./db.ts";

await connectDB();

export async function adjustBalance(userId: string, amount: number): Promise<number> {
  const res = await db.queryObject<{balance: number}>(
    "UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING balance",
    amount, userId
  );
  return res.rows[0].balance;
}

export async function topUpBalance(userId: string, amount: number): Promise<number> {
  return adjustBalance(userId, amount);
}

export async function deductBalance(userId: string, amount: number): Promise<number> {
  return adjustBalance(userId, -amount);
}
