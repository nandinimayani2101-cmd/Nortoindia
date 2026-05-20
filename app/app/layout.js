export const metadata = {
  title: "NoRTO India",
  description: "Reduce RTO losses"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
