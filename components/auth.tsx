"use client";

import { useState, useCallback } from "react";

// Services
import { signIn, signUp, forgotPassword } from "@/soil/services/auth";
import { createData } from "@/soil/services/client-data";
import { getInitialCredits } from "@/services/api";

export function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSignIn, setIsSignIn] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleError = useCallback((error: string) => {
    setStatus("error");
    setErrorMessage(error);
  }, []);

  const handleSignIn = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus("loading");

      try {
        await signIn(email, password, handleError);
        setStatus("idle");
      } catch (error) {
        handleError((error as Error).message);
      }
    },
    [email, password, handleError]
  );

  const handleSignUp = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus("loading");

      try {
        const usr = await signUp(email, password, confirmPassword, setErrorMessage);
        if (!usr) throw new Error("Failed to sign up");

        await createData({
          dataType: "user",
          dataKey: usr.uid,
          data: { email },
          owners: [usr.uid],
        });

        await getInitialCredits();

        setStatus("idle");
      } catch (error) {
        handleError((error as Error).message);
      }
    },
    [email, password, confirmPassword, handleError]
  );

  const handleForgotPassword = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus("loading");

      try {
        await forgotPassword(email);
        setStatus("idle");
        setErrorMessage("Password reset email sent. Please check your inbox.");
      } catch (error) {
        handleError((error as Error).message);
      }
    },
    [email, handleError]
  );

  return (
    <div className="flex flex-col justify-center items-center w-full mx-auto">
      {/* <h2 className="text-center font-semibold font-mono text-sm md:text-lg mb-14">
        {isForgotPassword ? "reset password" : isSignIn ? "sign in" : "sign up"}
      </h2> */}

      <form
        key="authform"
        onSubmit={isForgotPassword ? handleForgotPassword : isSignIn ? handleSignIn : handleSignUp}
        className="w-full space-y-4"
      >
        <div>
          <label htmlFor="email" className="block font-medium">
            Email address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="you@example.com"
            required
          />
        </div>
        {!isForgotPassword && (
          <div>
            <label htmlFor="password" className="block font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="Enter password"
              required
            />
          </div>
        )}
        {!isSignIn && !isForgotPassword && (
          <div>
            <label htmlFor="confirmPassword" className="block font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              placeholder="Confirm password"
              required
            />
          </div>
        )}

        <button type="submit" disabled={status === "loading"} className="w-full btn btn-lg my-4">
          {status === "loading"
            ? "Processing..."
            : isForgotPassword
            ? "Send Reset Link"
            : isSignIn
            ? "Sign in"
            : "Sign up"}
        </button>

        <div className="flex flex-col gap-2">
          {isSignIn && !isForgotPassword && (
            <button type="button" onClick={() => setIsForgotPassword(true)} className="w-full btn-ghost">
              Forgot password?
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setIsForgotPassword(false);
              setIsSignIn(!isSignIn);
            }}
            className="w-full btn-ghost"
          >
            {isSignIn ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>

          {isForgotPassword && (
            <button type="button" onClick={() => setIsForgotPassword(false)} className="w-full btn-ghost">
              Back to sign in
            </button>
          )}
        </div>
      </form>

      {status === "error" && (
        <div className="rounded-md bg-red-900 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
