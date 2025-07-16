import "../styles/globals.css";
import type { ReactNode } from "react";
import Providers from "../lib/provider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
