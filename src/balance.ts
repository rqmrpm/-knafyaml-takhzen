// src/balance.ts
import { db } from "./db.ts";

// تعديل رصيد المستخدم عند شحن أو هدايا أو خصم
export async function adjustBalance(userId: string, amount: number) {
  const user = await db.getUser(userId);
  if (!user) throw new Error("User not found");

  const newBalance = user.balance + amount;

  if (newBalance < 0) {
    throw new Error("Insufficient balance");
  }

  await db.updateBalance(userId, newBalance);
  return newBalance;
}

// شحن رصيد المستخدم (زيادة)
export async function topUpBalance(userId: string, amount: number) {
  if (amount <= 0) throw new Error("Amount must be positive");
  return await adjustBalance(userId, amount);
}

// خصم رصيد عند إرسال هدية
export async function deductBalance(userId: string, amount: number) {
  if (amount <= 0) throw new Error("Amount must be positive");
  return await adjustBalance(userId, -amount);
}
