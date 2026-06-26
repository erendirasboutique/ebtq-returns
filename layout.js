import localFont from "next/font/local";
import "./globals.css";
 
const bringboldNineties = localFont({
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
  description: "Create a return label for Erendira's Boutique.",
  icons: {
    icon: "/favicon.png"
  }
};
 
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${bringboldNineties.variable} ${mdNichrome.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
