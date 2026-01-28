// src/db.ts
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

// قراءة متغيرات البيئة
const DATABASE_URL = Deno.env.get("DATABASE_URL");
if (!DATABASE_URL) throw new Error("DATABASE_URL not defined in .env");

// إنشاء client للاتصال بالقاعدة
export const db = new Client(DATABASE_URL);

// فتح الاتصال
await db.connect();

// ======== دوال أساسية ========

// جلب بيانات مستخدم حسب id
export async function getUser(userId: string) {
  const result = await db.queryObject<{ id: string; username: string; avatar_url: string; balance: number }>(
    "SELECT id, username, avatar_url, balance FROM users WHERE id = $1",
    userId,
  );
  return result.rows[0];
}

// تعديل رصيد المستخدم
export async function updateBalance(userId: string, newBalance: number) {
  await db.queryArray(
    "UPDATE users SET balance = $1 WHERE id = $2",
    newBalance,
    userId,
  );
}

// تعديل صورة المستخدم
export async function updateAvatar(userId: string, avatarUrl: string) {
  await db.queryArray(
    "UPDATE users SET avatar_url = $1 WHERE id = $2",
    avatarUrl,
    userId,
  );
}

// إضافة جهة اتصال
export async function addContact(ownerId: string, contactId: string, contactName: string, contactAvatar: string) {
  await db.queryArray(
    "INSERT INTO contacts (owner_user_id, contact_user_id, contact_name, contact_avatar, saved_at) VALUES ($1,$2,$3,$4,NOW()) ON CONFLICT DO NOTHING",
    ownerId,
    contactId,
    contactName,
    contactAvatar,
  );
}

// جلب جهات اتصال مستخدم
export async function getContacts(ownerId: string) {
  const result = await db.queryObject<{ contact_user_id: string; contact_name: string; contact_avatar: string }>(
    "SELECT contact_user_id, contact_name, contact_avatar FROM contacts WHERE owner_user_id = $1",
    ownerId,
  );
  return result.rows;
}
