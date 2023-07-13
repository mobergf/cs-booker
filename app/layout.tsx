import { Providers } from "./providers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panga huvudskott",
  description: "Nu ska det verkligen pangas huvudskott",
  manifest: "/manifest.json",
  viewport:
    "width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no",
  icons: { icon: "/icons/icon-16x16.png", apple: "/apple-icon.png" },
  themeColor: "#317EFB",
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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
