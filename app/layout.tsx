import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/src/components/query-provider";

export const metadata: Metadata = {
  title: "Residential Monitoring Portal",
  description: "Fixed kiosk display for residential movement monitoring"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
