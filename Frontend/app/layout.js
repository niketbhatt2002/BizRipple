import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata = {
  title: "BizRipple - Policy Analysis for Small Businesses",
  description:
    "Simplify regulatory compliance with real-time policy insights and interactive tools.",
};


export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
