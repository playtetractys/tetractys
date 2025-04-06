import { createData } from "@/soil/services/server-data";
import { get, transactionWithCb } from "@/soil/services/firebase-admin";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser, StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Helpers
import { z } from "zod";
import { SYSTEM_PROMPT } from "@/services/constants";

// Types
import type { QandA, UserState } from "./types";
import { PATHS } from "@/soil/services/paths";

const QUOTE_DESCRIPTION = "A quote from some wise person.";
const QUOTE_AUTHOR_DESCRIPTION = "The author of the quote.";

const QUOTE_OUTPUT_PARSER = StructuredOutputParser.fromZodSchema(
  z.object({
    quote: z.string().describe(QUOTE_DESCRIPTION),
    quoteAuthor: z.string().describe(QUOTE_AUTHOR_DESCRIPTION),
  })
);

const STRING_OUTPUT_PARSER = new StringOutputParser();

const { OPENAI_API_KEY, OPENAI_MODEL } = process.env;

export async function generatePointQuestion(tetractysMessages: [string, string][]) {
  if (!OPENAI_API_KEY || !OPENAI_MODEL) throw new Error("OpenAI API key or model not found");

  const chatModel = new ChatOpenAI({
    modelName: OPENAI_MODEL,
    openAIApiKey: OPENAI_API_KEY,
    temperature: 0.6,
  });

  const messages: [string, string][] = [
    ["system", SYSTEM_PROMPT],
    ["developer", "Generate a question that helps the user find the answers they are looking for."],
    ...tetractysMessages,
  ];

  const chatPrompt = ChatPromptTemplate.fromMessages(messages);

  const llmChain = chatPrompt.pipe(chatModel).pipe(STRING_OUTPUT_PARSER);
  const response = await llmChain.invoke({});

  return response;
}

export async function generateSuggestedAnswer(tetractysMessages: [string, string][]) {
  if (!OPENAI_API_KEY || !OPENAI_MODEL) throw new Error("OpenAI API key or model not found");

  const chatModel = new ChatOpenAI({
    modelName: OPENAI_MODEL,
    openAIApiKey: OPENAI_API_KEY,
    temperature: 1,
  });

  const messages: [string, string][] = [
    ["system", "Generate a suggested single sentence answer to the last question you asked in the voice of the user."],
    ...tetractysMessages,
  ];

  const chatPrompt = ChatPromptTemplate.fromMessages(messages);

  const llmChain = chatPrompt.pipe(chatModel).pipe(STRING_OUTPUT_PARSER);
  const response = await llmChain.invoke({});

  return response;
}

export async function generateQuote(tetractysMessages: [string, string][]) {
  if (!OPENAI_API_KEY || !OPENAI_MODEL) throw new Error("OpenAI API key or model not found");

  const chatModel = new ChatOpenAI({
    modelName: OPENAI_MODEL,
    openAIApiKey: OPENAI_API_KEY,
    temperature: 1,
  });

  const messages: [string, string][] = [
    [
      "system",
      `Generate a quote from a wise person that helps the user find the answers they are looking for and relates to the last answer they provided.
      
{format_instructions}`,
    ],
    ...tetractysMessages,
  ];
  const chatPrompt = ChatPromptTemplate.fromMessages(messages);

  const llmChain = chatPrompt.pipe(chatModel).pipe(QUOTE_OUTPUT_PARSER);
  const format_instructions = QUOTE_OUTPUT_PARSER.getFormatInstructions();
  const response: Pick<QandA, "quote" | "quoteAuthor"> = await llmChain.invoke({
    format_instructions,
  });

  return response;
}

export async function saveOpenAiRequest(request: Request, messages: [string, string][], point: Partial<QandA>) {
  const { searchParams } = new URL(request.url);
  const tetractysKey = searchParams.get("tetractysKey");

  if (tetractysKey) {
    await createData({
      dataType: "openAiRequest",
      dataKey: tetractysKey,
      data: { messages, point },
      owners: [],
    });
  }
}

export async function consumeCredit(uid: string) {
  const creditsPath = PATHS.dataKeyField("userState", uid, "aiCredits");
  const credits = await get<UserState["aiCredits"]>(creditsPath);
  if (!credits || credits <= 0) return new Error("Insufficient credits");

  await transactionWithCb<UserState["aiCredits"]>(creditsPath, (currentCredits) => {
    return (currentCredits ?? 0) - 1;
  });
}
