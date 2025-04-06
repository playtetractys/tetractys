import { Suspense } from "react";

import "animate.css";
import "remixicon/fonts/remixicon.css";
import "@/app/globals.css";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <title>Tetractys | A game of AI-enabled galactic exploration and conquest</title>
      </head>
      <body className="antialiased flex flex-col min-h-svh">
        <Suspense>{children}</Suspense>
      </body>
    </html>
  );
}
