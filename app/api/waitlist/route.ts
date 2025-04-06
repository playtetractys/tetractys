import { NextResponse } from "next/server";

// Services
import { verifyAuth } from "@/services/verify-auth";
import { initializeBackendApp, set, transactionWithCb } from "@/soil/services/firebase-admin";
import { WaitListData, UserData } from "@/services/types";
import { INVITE_CODE_KEY } from "@/services/constants";

initializeBackendApp();

export async function POST(request: Request) {
  try {
    const authResponse = await verifyAuth(request);
    if (authResponse instanceof Error || !authResponse.uid) {
      return NextResponse.json({ error: authResponse.message }, { status: 401 });
    }

    await set<WaitListData[string]>(`waitList/${authResponse.uid}`, { createdAt: Date.now(), successfulInvites: 0 });

    const { email, inviteCode } = (await request.json()) as { email: string; inviteCode: string };

    const userData: UserData = { email, createdAt: Date.now() };
    if (inviteCode) userData.inviteCode = inviteCode;

    await set<UserData>(`users/${authResponse.uid}`, userData);

    if (inviteCode) {
      await transactionWithCb<number>(`waitList/${inviteCode}/successfulInvites`, (successfulInvites) => {
        if (!successfulInvites) return 1;
        return successfulInvites + 1;
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Waitlist] Error processing request:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error generating initial waitList" },
      { status: 500 }
    );
  }
}
