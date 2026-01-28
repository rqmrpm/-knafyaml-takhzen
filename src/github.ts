// src/github.ts
import { readFileStr } from "https://deno.land/std/fs/mod.ts";

// قراءة متغيرات البيئة
const GITHUB_REPO = Deno.env.get("GITHUB_REPO");
const GITHUB_TOKEN = Deno.env.get("GITHUB_TOKEN");

if (!GITHUB_REPO || !GITHUB_TOKEN) throw new Error("GITHUB_REPO or GITHUB_TOKEN not defined in .env");

// الدالة الرئيسية لرفع أو تعديل صورة مستخدم
export async function uploadUserImage(userId: string, filePath: string): Promise<string> {
  // قراءة الصورة كـ Base64
  const imageData = await Deno.readFile(filePath);
  const base64Image = btoa(String.fromCharCode(...imageData));

  // تحديد مسار الملف بالمستودع
  const fileName = `${userId}.png`; // يمكن تعديل الصيغة حسب الصورة
  const repoPath = `users/${fileName}`;

  // التحقق إذا الملف موجود مسبقًا للحصول على SHA للتعديل
  let sha: string | null = null;
  try {
    const getResp = await fetch(`https://api.github.com/repos/${getRepoPath()}/contents/${repoPath}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    });
    if (getResp.status === 200) {
      const data = await getResp.json();
      sha = data.sha;
    }
  } catch (err) {
    console.warn("File check failed, assuming new file.", err);
  }

  // رفع أو تعديل الملف
  const resp = await fetch(`https://api.github.com/repos/${getRepoPath()}/contents/${repoPath}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({
      message: `Upload avatar for user ${userId}`,
      content: base64Image,
      sha: sha || undefined,
    }),
  });

  if (!resp.ok) {
    throw new Error(`Failed to upload image: ${resp.statusText}`);
  }

  const json = await resp.json();
  // الرابط المباشر للملف
  const downloadUrl = json.content.download_url;
  return downloadUrl;
}

// استخراج صاحب المستودع من الرابط
function getRepoPath() {
  // مثال: https://github.com/username/repo
  const match = GITHUB_REPO.match(/github\.com\/(.+\/.+)$/);
  if (!match) throw new Error("Invalid GITHUB_REPO format");
  return match[1];
}
