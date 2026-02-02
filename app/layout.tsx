import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Enrollment Coach - Awaken Training",
  description: "AI-powered sales pipeline and coaching for Awaken Training enrollment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-body">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
