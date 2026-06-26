import localFont from "next/font/local";
import "./globals.css";

const bringbold = localFont({
  src: "./fonts/bringbold_nineties_regular.otf",
  variable: "--font-heading",
  display: "swap"
});

const mdNichrome = localFont({
  src: "./fonts/MDNichrome-Bold.otf",
  variable: "--font-body",
  display: "swap"
});

export const metadata = {
  title: "Erendira's Boutique | Returns",
  description: "Submit a return request for Erendira's Boutique.",
  icons: { icon: "/favicon.png" }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bringbold.variable} ${mdNichrome.variable}`}>
      <body>{children}</body>
    </html>
  );
}
