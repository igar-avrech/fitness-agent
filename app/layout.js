export const metadata = {
  title: "הסוכן האישי שלי | כושר ותזונה",
  description: "סוכן כושר ותזונה אישי",
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#0a0a0f" }}>{children}</body>
    </html>
  );
}
