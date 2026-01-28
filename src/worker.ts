// worker.ts
import { adjustBalance, topUpBalance, deductBalance } from "./balance.ts";
import { uploadUserImage } from "./github.ts";
import { addContact, getContacts } from "./contacts.ts";

console.log("Storage Worker running...");

Deno.serve(async (req) => {
  try {
    const data = await req.json();
    const { action, payload } = data;

    let response: any = {};

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

    return new Response(JSON.stringify(response), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { headers: { "Content-Type": "application/json" } });
  }
});
