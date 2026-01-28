// src/contacts.ts
import { db } from "./db.ts";

// إضافة جهة اتصال
export async function addContact(ownerId: string, contactId: string, contactName: string, contactAvatar: string) {
  await db.addContact(ownerId, contactId, contactName, contactAvatar);
}

// جلب جهات اتصال المستخدم
export async function getContacts(ownerId: string) {
  return await db.getContacts(ownerId);
}

// حذف جهة اتصال
export async function removeContact(ownerId: string, contactId: string) {
  // إذا حبيت تضيف دالة للحذف
  await db.queryArray(
    "DELETE FROM contacts WHERE owner_user_id = $1 AND contact_user_id = $2",
    ownerId,
    contactId,
  );
}
