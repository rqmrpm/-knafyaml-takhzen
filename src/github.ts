// github.ts
const repo = Deno.env.get("GITHUB_REPO")!;
const token = Deno.env.get("GITHUB_TOKEN")!;

export async function uploadUserImage(userId: string, filePath: string): Promise<string> {
  const fileContent = await Deno.readFile(filePath);
  const base64Content = btoa(String.fromCharCode(...fileContent));

  const response = await fetch(`https://api.github.com/repos/${repo}/contents/${userId}.png`, {
    method: "PUT",
    headers: {
      "Authorization": `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `Upload avatar for ${userId}`,
      content: base64Content,
      branch: "main",
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content.download_url; // رابط مباشر للصورة
}
