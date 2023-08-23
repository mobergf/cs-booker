import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Huvudskott",
  description: "Panga hårda skott i huvudet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="grid h-screen place-items-center">{children}</div>
    </section>
  );
}
