import { createHmac } from "node:crypto";
import Link from "next/link";

// In production, use an environment variable for the secret
const SECRET = "my_secret";

function getToken(id: string): string {
  const hmac = createHmac("sha256", SECRET);
  hmac.update(JSON.stringify({ id: id }));
  return hmac.digest("hex");
}

export default function Home() {
  const ids = ["a", "b", "c"];

  return (
    <main>
      <h1>Encrypted Open Graph Image Example</h1>
      <p>
        This example demonstrates how to prevent generating OG images with
        random parameters by using HMAC tokens for validation.
      </p>

      <h2>How it works:</h2>
      <ol>
        <li>Each page generates an HMAC token based on its ID</li>
        <li>The OG image API validates the token before generating the image</li>
        <li>Invalid tokens result in a 401 Unauthorized response</li>
      </ol>

      <h2>Valid Pages:</h2>
      <ul>
        {ids.map((id) => {
          const token = getToken(id);
          return (
            <li key={id}>
              <Link href={`/${id}`}>
                <code>/{id}</code>
              </Link>
              {" — Token: "}
              <code>{token.slice(0, 16)}...</code>
            </li>
          );
        })}
      </ul>

      <h2>Try it:</h2>
      <ul>
        <li>
          <Link href="/api/encrypted?id=a&token=invalid">
            Invalid token (will fail)
          </Link>
        </li>
        <li>
          <Link href={`/api/encrypted?id=a&token=${getToken("a")}`}>
            Valid token for &quot;a&quot; (will work)
          </Link>
        </li>
      </ul>
    </main>
  );
}
