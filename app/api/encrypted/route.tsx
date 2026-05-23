import { ImageResponse } from "next/og";
import { createHmac } from "node:crypto";
import type { NextRequest } from "next/server";

// In production, use an environment variable for the secret
const SECRET = "my_secret";

function getToken(id: string): string {
  const hmac = createHmac("sha256", SECRET);
  hmac.update(JSON.stringify({ id: id }));
  return hmac.digest("hex");
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");
  const token = searchParams.get("token");

  // Validate required parameters
  if (!id || !token) {
    return new Response("Missing id or token parameter", { status: 400 });
  }

  // Validate the token
  const expectedToken = getToken(id);
  if (token !== expectedToken) {
    return new Response("Invalid token - unauthorized access", { status: 401 });
  }

  // Generate the OG image
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1a2e",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #16213e 2%, transparent 0%), radial-gradient(circle at 75px 75px, #16213e 2%, transparent 0%)",
          backgroundSize: "100px 100px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: "24px",
            padding: "48px 64px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0070f3"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span
              style={{
                marginLeft: "16px",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#0070f3",
              }}
            >
              Encrypted OG
            </span>
          </div>
          <div
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              color: "#111",
              marginBottom: "16px",
            }}
          >
            Page: {id.toUpperCase()}
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "#666",
            }}
          >
            Token validated successfully ✓
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
