import { Flip, ToastContainer } from "react-toastify";
import { Suspense } from "react";
import { AppLayout } from "@/components/app-layout";
import { SoilContextProviderComponent } from "@/soil/context";

import type { FirebaseOptions } from "firebase/app";

import "animate.css";
import "remixicon/fonts/remixicon.css";
import "@/app/globals.css";

const FIREBASE_OPTIONS = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_OPTIONS!) as FirebaseOptions;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <title>Tetractys | A game of AI-enabled galactic exploration and conquest</title>
      </head>
      <body className="antialiased flex flex-col min-h-svh">
        <SoilContextProviderComponent firebaseOptions={FIREBASE_OPTIONS}>
          <Suspense>
            <AppLayout>{children}</AppLayout>
          </Suspense>
        </SoilContextProviderComponent>
        <ToastContainer
          position="bottom-center"
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Flip}
        />
      </body>
    </html>
  );
}
