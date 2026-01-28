// src/index.ts
import { handleRequest } from "./worker.ts";
import "dotenv/config";

// متغيرات البيئة
const PORT = Deno.env.get("PORT") || "8000";

console.log(`Storage Worker running on port ${PORT}`);

// دالة بسيطة لتشغيل HTTP server يستقبل الطلبات من باقي العمال
const server = Deno.listen({ port: parseInt(PORT) });

for await (const conn of server) {
  handleRequest(conn).catch((err) => {
    console.error("Error handling request:", err);
  });
}
