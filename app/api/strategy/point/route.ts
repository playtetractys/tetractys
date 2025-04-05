import { NextResponse } from "next/server";

// Services
import { verifyTetractysOwnership } from "@/services/verify-auth";
import { initializeBackendApp } from "@/soil/services/firebase-admin";
import { generatePointQuestion, generateQuote, consumeCredit, saveOpenAiRequest } from "@/services/apiUtils";

// Helpers
import { PLACEHOLDER_POINT } from "@/services/constants";

// Types
import type { QandA } from "@/services/types";

initializeBackendApp();

const { TETRACTYS_RESPONSE_MODE } = process.env;

export async function POST(request: Request) {
  try {
    const verification = await verifyTetractysOwnership(request);
    if (verification instanceof Error) return NextResponse.json({ error: verification.message }, { status: 401 });
    const tetractysMessages = (await request.json()) as [string, string][];

    if (TETRACTYS_RESPONSE_MODE === "placeholder") {
      return NextResponse.json(PLACEHOLDER_POINT as QandA);
    }

    const question = await generatePointQuestion(tetractysMessages);
    const { quote, quoteAuthor } = await generateQuote(tetractysMessages);

    const point: QandA = { question, quote, quoteAuthor };

    await saveOpenAiRequest(request, tetractysMessages, point);

    await consumeCredit(verification.authResponse.uid);

    return NextResponse.json(point);
  } catch (error) {
    console.error("Error generating tetractys point", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error generating tetractys points" },
      { status: 500 }
    );
  }
}
