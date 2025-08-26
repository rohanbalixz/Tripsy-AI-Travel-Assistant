export const metadata = {
  title: "Tripsy",
  description: "Travel planning that feels like magic — private, fast & free."
};

import "leaflet/dist/leaflet.css";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0b0f12", color: "#e5fbea" }}>
        {children}
      </body>
    </html>
  );
}
