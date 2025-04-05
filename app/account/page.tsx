"use client";

import Link from "next/link";
import { useState, useCallback } from "react";

// Services
import { useSoilContext } from "@/soil/context";
import { signIn, signUserOut, updateUserEmail, updateUserPassword } from "@/soil/services/auth";
import { Auth } from "@/components/auth";

export default function Account() {
  const { user, isAdmin } = useSoilContext();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleEmailChange = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user?.email) return;

      setError("");
      setSuccess(false);

      try {
        const u = await signIn(user.email, currentPassword, setError);
        if (u) {
          await updateUserEmail(newEmail);
          setSuccess(true);
          setCurrentPassword("");
          setNewEmail("");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to update email. Please check your current password.");
      }
    },
    [currentPassword, newEmail, user?.email]
  );

  const handlePasswordChange = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user?.email) return;

      setError("");
      setSuccess(false);

      if (newPassword !== confirmPassword) {
        setError("New passwords don't match");
        return;
      }

      try {
        const u = await signIn(user.email, currentPassword, setError);
        if (u) {
          await updateUserPassword(newPassword);
          setSuccess(true);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to update password. Please check your current password.");
      }
    },
    [currentPassword, newPassword, confirmPassword, user?.email]
  );

  const handleSignOut = useCallback(() => {
    signUserOut().then(() => window.location.reload());
  }, []);

  if (!user) return null;

  if (user?.isAnonymous) return <Auth />;

  return (
    <div className="max-w-lg w-full mx-auto p-8">
      <h1 className="text-3xl font-mono my-20 text-center">account</h1>

      <div className="mb-12">
        <div className="bg-zinc-800 rounded-lg p-2">
          <label className="block text-sm font-medium">Email</label>
          <div className="text-lg">{user.email}</div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-mono mb-10 text-center">change email</h2>
        <form onSubmit={handleEmailChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="input"
              placeholder="Enter your current password"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="input"
              placeholder="Enter your new email address"
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">Email updated successfully!</div>}
          <button type="submit" className="btn w-full">
            Update Email
          </button>
        </form>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-mono mb-6 text-center">change password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="input"
              placeholder="Enter your current password"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input"
              placeholder="Enter your new password"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              placeholder="Confirm your new password"
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">Password updated successfully!</div>}
          <button type="submit" className="btn w-full">
            Update Password
          </button>
        </form>
      </div>

      {isAdmin && (
        <div className="mb-8">
          <Link
            href="/admin"
            className="block w-full px-6 py-3 text-sm font-medium text-orange-600 border border-orange-600 rounded-lg transition-colors hover:bg-orange-600 hover:text-white text-center"
          >
            Admin Dashboard
          </Link>
        </div>
      )}

      <div className="w-fit mx-auto">
        <button onClick={handleSignOut} className="w-fit mx-auto btn-ghost">
          Sign Out
        </button>
      </div>
    </div>
  );
}
