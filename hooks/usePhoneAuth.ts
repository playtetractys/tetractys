import { RefObject, useCallback, useEffect, useState } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies

// Services
import { ConfirmationResult, RecaptchaVerifier, getAuth, signInWithPhoneNumber } from "firebase/auth";
import { useSoilContext } from "@/soil/context";
import { validatePhoneNumber } from "@/utils/format";

export const usePhoneAuth = (buttonElementId: string, phoneNumberElement: RefObject<HTMLInputElement>) => {
  const { userUid, initiallyLoading } = useSoilContext();
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult>();
  const [error, setError] = useState<string>();

  const enabled = Boolean(userUid || !initiallyLoading);
  useEffect(() => {
    if (enabled) {
      window.recaptchaVerifier = new RecaptchaVerifier(getAuth(), buttonElementId, { size: "invisible" });
    }
  }, [buttonElementId, enabled]);

  const handleSubmit = useCallback(async () => {
    const appVerifier = window.recaptchaVerifier;
    try {
      if (!phoneNumberElement.current || !appVerifier) {
        // eslint-disable-next-line no-console
        console.error("Missing something in usePhoneAuth", {
          phoneNumberElement: phoneNumberElement.current,
          appVerifier,
        });
        throw Error("There was a problem signing you in. Please contact support.");
      }

      const validatedPhone = validatePhoneNumber(phoneNumberElement.current.value);

      setConfirmationResult(await signInWithPhoneNumber(getAuth(), validatedPhone, appVerifier));
    } catch (e) {
      if (e instanceof Error) setError(e.message);
    }
  }, [phoneNumberElement]);

  return { showCodeInput: Boolean(confirmationResult), handleSubmit, error };
};
