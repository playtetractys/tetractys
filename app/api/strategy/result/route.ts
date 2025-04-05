// Services
import { NextResponse } from "next/server";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import { verifyTetractysOwnership } from "@/services/verify-auth";
import { initializeBackendApp } from "@/soil/services/firebase-admin";
import { consumeCredit } from "@/services/apiUtils";

// Helpers
import { LIPSUM, RESULT_DEVELOPER_PROMPT, SYSTEM_PROMPT } from "@/services/constants";

initializeBackendApp();

const stringOutputParser = new StringOutputParser();

const { TETRACTYS_RESPONSE_MODE, OPENAI_API_KEY, OPENAI_MODEL } = process.env;

export async function POST(request: Request) {
  try {
    const verification = await verifyTetractysOwnership(request);
    if (verification instanceof Error) return NextResponse.json({ error: verification.message }, { status: 401 });
    const tetractysMessages = (await request.json()) as [string, string][];

    if (TETRACTYS_RESPONSE_MODE === "placeholder") return NextResponse.json({ result: LIPSUM });

    if (!OPENAI_API_KEY || !OPENAI_MODEL) {
      return NextResponse.json({ error: "OpenAI API key or model not found" }, { status: 500 });
    }

    const chatModel = new ChatOpenAI({ modelName: OPENAI_MODEL, openAIApiKey: OPENAI_API_KEY });

    const messages: [string, string][] = [
      ["system", SYSTEM_PROMPT],
      ["developer", RESULT_DEVELOPER_PROMPT],
      ...tetractysMessages,
    ];

    const chatPrompt = ChatPromptTemplate.fromMessages(messages);

    const llmChain = chatPrompt.pipe(chatModel).pipe(stringOutputParser);
    const result: string = await llmChain.invoke({});

    await consumeCredit(verification.authResponse.uid);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error generating tetractys result", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error generating tetractys result" },
      { status: 500 }
    );
  }
}
