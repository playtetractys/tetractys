import { NextResponse } from "next/server";

// Services
import { verifyAuth } from "@/services/verify-auth";
import { get, initializeBackendApp, set } from "@/soil/services/firebase-admin";

// Types
import type { Credits } from "@/services/types";

initializeBackendApp();

export async function GET(request: Request) {
  try {
    const authResponse = await verifyAuth(request);
    if (authResponse instanceof Error || !authResponse.uid) {
      return NextResponse.json({ error: authResponse.message }, { status: 401 });
    }

    const creditsPath = `credits/${authResponse.uid}`;
    const credits = await get<Credits>(creditsPath);

    if (!credits) {
      await set(creditsPath, { amount: 10 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error generating initial credits", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error generating initial credits" },
      { status: 500 }
    );
  }
}
