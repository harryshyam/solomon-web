import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "SOLOMON | Global Prediction Market",
  description: "Trade real-world outcomes on Base",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0b0f19] text-gray-100 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}