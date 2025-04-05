import { NextResponse } from "next/server";

// Services
import { verifyTetractysOwnership } from "@/services/verify-auth";
import { initializeBackendApp } from "@/soil/services/firebase-admin";
import { generateSuggestedAnswer, saveOpenAiRequest, consumeCredit } from "@/services/apiUtils";

// Helpers
import { PLACEHOLDER_ANSWER } from "@/services/constants";

initializeBackendApp();

const { TETRACTYS_RESPONSE_MODE } = process.env;

export async function POST(request: Request) {
  try {
    const verification = await verifyTetractysOwnership(request);
    if (verification instanceof Error) return NextResponse.json({ error: verification.message }, { status: 401 });
    const tetractysMessages = (await request.json()) as [string, string][];

    if (TETRACTYS_RESPONSE_MODE === "placeholder") return NextResponse.json({ answer: PLACEHOLDER_ANSWER });

    const answer = await generateSuggestedAnswer(tetractysMessages);

    await saveOpenAiRequest(request, tetractysMessages, { answer });

    await consumeCredit(verification.authResponse.uid);

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Error generating tetractys point", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error generating tetractys points" },
      { status: 500 }
    );
  }
}
