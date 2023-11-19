import { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#00837C",
};
export const metadata: Metadata = {
  title: "Panga huvudskott",
  description: "Nu ska det verkligen pangas huvudskott",
  manifest: "/manifest.json",

  icons: { icon: "/favicon-16x16.png", apple: "/apple-touch-icon.png" },
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
      <body className="bg-white text-secondary-dark dark:bg-[#07141f] dark:text-zinc-200">
        <div className="h-full w-full bg-opacity-50 bg-gradient-to-tl from-[#fff] via-[#a2c0ed70] dark:from-transparent  dark:via-transparent">
          {children}
        </div>
      </body>
    </html>
  );
}
