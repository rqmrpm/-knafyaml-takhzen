// contacts.ts
import { db, connectDB } from "./db.ts";

await connectDB();

export async function addContact(ownerId: string, contactId: string, contactName: string, contactAvatar: string) {
  await db.queryObject(
    "INSERT INTO contacts (owner_id, contact_id, contact_name, contact_avatar) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING",
    ownerId, contactId, contactName, contactAvatar
  );
}

export async function getContacts(ownerId: string) {
  const res = await db.queryObject(
    "SELECT contact_id, contact_name, contact_avatar FROM contacts WHERE owner_id = $1",
    ownerId
  );
  return res.rows;
}
