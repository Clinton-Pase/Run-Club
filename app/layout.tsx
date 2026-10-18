import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";



const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});


export const metadata: Metadata = {
  title: {
    default: "ALX Run Club",
    template: "%s | ALX Run Club",
  },
  description:
    "Join ALX Run Club to connect with runners, discover club events, and stay active together.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className=" min-h-full flex flex-col">{children}</body>
    </html>
  );
}
