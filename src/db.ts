// db.ts
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

// ربط قاعدة البيانات باستخدام Environment Variable
export const db = new Client(Deno.env.get("DATABASE_URL")!);

// دالة اتصال (إذا بدك تستخدمها قبل أي استعلام)
export async function connectDB() {
  await db.connect();
}
