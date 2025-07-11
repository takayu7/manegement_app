import "@/app/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className="antialiased flex h-screen flex-col md:flex-row md:overflow-hidden"
      >
        <div className="flex-grow bg-gray-200 md:overflow-y-auto md:p-12">
          {children}
        </div>
      </body>
    </html>
  );
}