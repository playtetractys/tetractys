"use client";

import { useWaitlistContext } from "@/contexts/waitlistContext";
import { useState, useEffect, useCallback, useMemo } from "react";
import { MotionDiv } from "./motions/motion-div";

export function WaitList() {
  const {
    handleAddToWaitList,
    originalPosition,
    currentPosition,
    waitListTotal,
    shareLinkUrl,
    successfulInvites,
    userWaitListData,
  } = useWaitlistContext();

  const [email, setEmail] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>();
  const [copyStatus, setCopyStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // If shareLinkUrl becomes available via props update after submission, update isSubmitted
  useEffect(() => {
    setIsSubmitted((prev) => prev || !!userWaitListData);
  }, [userWaitListData]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setError(""); // Clear previous errors

      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        setError("Please enter a valid email address.");
        return;
      }

      setIsLoading(true);
      try {
        // Call the function passed via props
        await handleAddToWaitList(email);
        // Assume success if no error is thrown
        setIsSubmitted(true);
        setEmail(""); // Clear email field on success
      } catch (err) {
        console.error("Error adding to waitlist:", err);
        setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
        setIsSubmitted(false); // Ensure we stay on the form if submission failed
      } finally {
        setIsLoading(false);
      }
    },
    [handleAddToWaitList, email]
  );

  const handleCopyLink = () => {
    if (!shareLinkUrl) return;

    navigator.clipboard
      .writeText(shareLinkUrl)
      .then(() => {
        setCopyStatus("Copied!");
        setTimeout(() => setCopyStatus(""), 2000); // Clear message after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
        setCopyStatus("Failed to copy");
        setTimeout(() => setCopyStatus(""), 2000);
      });
  };

  // Calculate positions moved up, ensuring it's not negative
  const positionsMovedUp = useMemo(
    () => (originalPosition !== null && currentPosition !== null ? Math.max(0, originalPosition - currentPosition) : 0),
    [originalPosition, currentPosition]
  );

  return (
    <div className="px-2 py-10 waitlist-background">
      <MotionDiv direction="up" className="text-center">
        <h1 className="text-4xl font-mono my-8"> EARLY ACCESS</h1>
        <h2 className="text-2xl font-bold mb-2">Be the first to play Tetractys!</h2>
        {!isSubmitted && (
          <h3 className="text-xl font-semibold font-serif mb-2">
            Join the Waitlist to be among the first to write the story of humaniy across the galaxy!
          </h3>
        )}
        <div className="mt-16 font-sans p-5 border border-zinc-700 rounded-lg max-w-md mx-auto my-5 bg-zinc-900 text-zinc-100">
          {!isSubmitted ? (
            // --- Email Signup Form ---
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold mb-2">Join the Waitlist!</h2>
              <p className="mb-4">Enter your email below to secure your spot in the early access of Tetractys!</p>
              <div className="flex flex-col md:flex-row gap-2.5 mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="flex-grow p-2.5 border border-zinc-600 rounded bg-zinc-800 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white"
                  required
                  disabled={isLoading}
                />
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? "Joining..." : "Join Waitlist"}
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </form>
          ) : (
            // --- Waitlist Status & Sharing ---
            <div>
              <h2 className="text-2xl mb-4 text-zinc-300">
                You&apos;re <span className="font-bold text-white">{currentPosition}</span> of {waitListTotal} on the
                list!
              </h2>

              {successfulInvites > 0 && (
                <div className="flex flex-col gap-2.5">
                  {originalPosition !== null && currentPosition !== null && originalPosition > currentPosition && (
                    <p className="mb-2.5">
                      You&apos;ve moved up <span className="font-bold text-green-400">{positionsMovedUp}</span> places!
                    </p>
                  )}
                  {originalPosition !== null && (
                    <p className="mb-2.5">
                      Your original position was: <span className="font-bold text-white">{originalPosition}</span>
                    </p>
                  )}
                  <p className="mb-2.5">
                    Friends referred: <span className="font-bold text-white">{successfulInvites}</span>
                  </p>
                </div>
              )}

              {currentPosition !== null && shareLinkUrl && (
                <div className="mt-5 pt-5 border-t border-zinc-700">
                  <h3 className="text-xl font-semibold mb-3">Share & Move Up!</h3>
                  <p className="mb-4">
                    Share your unique link with friends. For every friend who signs up, you&apos;ll move up the list!
                  </p>
                  <div className="flex flex-col md:flex-row gap-2.5">
                    <input
                      type="text"
                      value={shareLinkUrl}
                      readOnly
                      className="w-full p-2.5 border border-zinc-600 rounded bg-zinc-800 text-zinc-100 cursor-text focus:outline-none focus:ring-2 focus:ring-white"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <button onClick={handleCopyLink} className="btn btn-primary">
                      {copyStatus ? copyStatus : "Copy Link"}
                    </button>
                  </div>
                </div>
              )}

              {currentPosition !== null && !shareLinkUrl && (
                <div className="mt-5 pt-5 border-t border-zinc-700">
                  <p>Your unique share link is being generated...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </MotionDiv>
    </div>
  );
}
