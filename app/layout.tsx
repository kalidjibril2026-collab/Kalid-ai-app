import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Encrypted OG Image Example",
  description: "Prevent generating OG images with random parameters using HMAC tokens",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
