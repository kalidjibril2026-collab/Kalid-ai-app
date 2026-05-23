import { createHmac } from "node:crypto";
import Link from "next/link";
import { notFound } from "next/navigation";

// In production, use an environment variable for the secret
const SECRET = "my_secret";

// Only allow specific IDs
const VALID_IDS = ["a", "b", "c"];

function getToken(id: string): string {
  const hmac = createHmac("sha256", SECRET);
  hmac.update(JSON.stringify({ id: id }));
  return hmac.digest("hex");
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  // Only allow predefined IDs
  if (!VALID_IDS.includes(id)) {
    notFound();
  }

  const token = getToken(id);
  const ogImageUrl = `/api/encrypted?id=${id}&token=${token}`;

  return (
    <main>
      <h1>Encrypted Open Graph Image</h1>
      <p>
        Page ID: <code>{id}</code>
      </p>
      <p>
        Token: <code>{token}</code>
      </p>

      <h2>OG Image Preview:</h2>
      <p>Only requests with the correct token can access this image:</p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ogImageUrl}
        alt={`OG Image for ${id}`}
        style={{
          maxWidth: "600px",
          width: "100%",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      />

      <h2>URLs:</h2>
      <ul>
        <li>
          <strong>Valid URL:</strong>{" "}
          <a href={ogImageUrl}>
            <code>/api/encrypted?id={id}&token={token.slice(0, 16)}...</code>
          </a>
        </li>
        <li>
          <strong>Invalid URL:</strong>{" "}
          <a href={`/api/encrypted?id=${id}&token=invalid_token`}>
            <code>/api/encrypted?id={id}&token=invalid_token</code>
          </a>{" "}
          (401 error)
        </li>
      </ul>

      <p>
        <Link href="/">← Back to Home</Link>
      </p>
    </main>
  );
}

// Generate static pages for valid IDs
export function generateStaticParams() {
  return VALID_IDS.map((id) => ({ id }));
}
