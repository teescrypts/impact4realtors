import { dmSans, inter, playfairDisplay } from "./theme/font";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfairDisplay.variable} ${inter.variable}`}
    >
      <body style={{ margin: 0 }}>
        <main>{children}</main>
      </body>
    </html>
  );
}
