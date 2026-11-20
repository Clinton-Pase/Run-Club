import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";



const poppins = localFont({
  src: [
    { path: "./fonts/Poppins-Regular.ttf", weight: "400" },
    { path: "./fonts/Poppins-Medium.ttf", weight: "500" },
    { path: "./fonts/Poppins-SemiBold.ttf", weight: "600" },
    { path: "./fonts/Poppins-Bold.ttf", weight: "700" },
    { path: "./fonts/Poppins-ExtraBold.ttf", weight: "800" },
  ],
  variable: "--font-poppins",
  display: "swap",
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
