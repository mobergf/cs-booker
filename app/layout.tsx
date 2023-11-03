import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Panga huvudskott",
  description: "Nu ska det verkligen pangas huvudskott",
  manifest: "/manifest.json",
  viewport:
    "width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no",
  icons: { icon: "/icons/icon-16x16.png", apple: "/apple-icon.png" },
  themeColor: "#00837C",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <body className="bg-white text-secondary-dark dark:bg-[#07141f]   dark:text-zinc-200">
        {children}
      </body>
    </html>
  );
}
