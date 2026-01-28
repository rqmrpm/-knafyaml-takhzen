// src/worker.ts
import { adjustBalance, topUpBalance, deductBalance } from "./balance.ts";
import { uploadUserImage } from "./github.ts";
import { addContact, getContacts } from "./contacts.ts";
import { db } from "./db.ts";

export async function handleRequest(conn: Deno.Conn) {
  const buf = new Uint8Array(1024 * 4);
  const n = await conn.read(buf);
  if (!n) return;

  const rawData = new TextDecoder().decode(buf.subarray(0, n));
  let data;
  try {
    data = JSON.parse(rawData);
  } catch {
    await conn.write(new TextEncoder().encode("Invalid JSON"));
    return;
  }

  const { action, payload } = data;

  let response: any = {};

  try {
    switch (action) {
      case "upload_avatar":
        response.url = await uploadUserImage(payload.userId, payload.filePath);
        break;

      case "adjust_balance":
        response.newBalance = await adjustBalance(payload.userId, payload.amount);
        break;

      case "top_up":
        response.newBalance = await topUpBalance(payload.userId, payload.amount);
        break;

      case "deduct_balance":
        response.newBalance = await deductBalance(payload.userId, payload.amount);
        break;

      case "add_contact":
        await addContact(payload.ownerId, payload.contactId, payload.contactName, payload.contactAvatar);
        response.status = "ok";
        break;

      case "get_contacts":
        response.contacts = await getContacts(payload.ownerId);
        break;

      default:
        response.error = "Unknown action";
    }
  } catch (err) {
    response.error = err.message;
  }

  await conn.write(new TextEncoder().encode(JSON.stringify(response)));
  conn.close();
}
