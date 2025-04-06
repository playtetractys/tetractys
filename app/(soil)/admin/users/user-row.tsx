import { toast } from "react-toastify";
import { useCallback } from "react";

// Services
import { useSoilContext } from "@/soil/context";
import { generateDbKey } from "@/soil/services/paths";
import { forgotPassword } from "@/soil/services/auth";
import { get } from "@/soil/services/firebase";
import { removeData } from "@/soil/services/client-data";

// Types
import type { Data } from "@/soil/services/types";

async function deleteUser(uid: string) {
  if (window.confirm(`Are you sure you want to delete this user?`)) {
    await fetch(`/api/admin/users?uid=${uid}&adminKey=${await get<string>("/adminKey")}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    await removeData({ dataType: "user", dataKey: uid });
    toast.success("User deleted successfully");
  }
}

async function getPasswordResetLink(email: string) {
  const response = await fetch(
    `/api/admin/reset-password-link?email=${email}&adminKey=${await get<string>("/adminKey")}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  return data.link;
}

export function UserRow({ userData: [key, usr] }: { userData: [string, Data<"user">] }) {
  const { user } = useSoilContext();

  const handleClear = useCallback(async (userId: string) => {
    if (!confirm("Are you sure you want to clear this user's data?")) return;

    await removeData({ dataType: "soilUserSettings", dataKey: generateDbKey(userId, "skippedAt") });
    await removeData({ dataType: "soilUserSettings", dataKey: generateDbKey(userId, "actsOfKindnessCreatedAt") });
    await removeData({ dataType: "soilUserSettings", dataKey: generateDbKey(userId, "sharedAt") });
    toast.success("User data cleared successfully");
  }, []);

  const handleSendReset = useCallback(async (email: string) => {
    if (!confirm(`Are you sure you want to send a reset link to ${email}?`)) return;

    await forgotPassword(email);
    toast.success("Reset link sent successfully");
  }, []);

  return (
    <tr className={`border-b hover:bg-zinc-50 ${key === user?.uid ? "bg-zinc-100" : ""}`}>
      <td className="p-4 border truncate max-w-[200px]">{usr.email || ""}</td>
      <td className="p-4 border truncate max-w-[150px]">{key}</td>
      <td className="p-4 border truncate max-w-[150px]">{new Date(usr.createdAt).toLocaleDateString()}</td>
      <td className="p-4 border-r flex gap-2 justify-end">
        <button
          onClick={() => deleteUser(key)}
          className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-600 hover:text-white transition-colors text-sm"
        >
          Delete
        </button>
        <button
          onClick={() => handleClear(key)}
          className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-600 hover:text-white transition-colors text-sm"
        >
          Clear
        </button>
        <button
          onClick={() => handleSendReset(usr.email)}
          className="px-3 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-600 hover:text-white transition-colors text-sm"
        >
          Send Reset
        </button>
        <button
          onClick={async () => {
            const link = await getPasswordResetLink(usr.email);
            await navigator.clipboard.writeText(link);
            window.alert("Password reset link copied to clipboard");
          }}
          className="h-fit px-3 py-1 border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors text-sm"
        >
          Copy Reset Link
        </button>
      </td>
    </tr>
  );
}
