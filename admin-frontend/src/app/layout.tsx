import type { Metadata } from "next";
import "../index.css";
import "../screens/admin.css";

export const metadata: Metadata = {
  title: "ZEEN Admin",
  description: "ZEEN store administration",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
