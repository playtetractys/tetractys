import { Flip, ToastContainer } from "react-toastify";
import { AppLayout } from "@/components/app-layout";
import { SoilContextProviderComponent } from "@/soil/context";

import type { FirebaseOptions } from "firebase/app";

const FIREBASE_OPTIONS = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_OPTIONS!) as FirebaseOptions;

export default function SoilLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SoilContextProviderComponent firebaseOptions={FIREBASE_OPTIONS}>
        <AppLayout>{children}</AppLayout>
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
    </>
  );
}
