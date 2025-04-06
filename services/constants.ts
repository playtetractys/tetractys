import type { QandA } from "./types";

export const TEMPLATE_KEY = "story";

export const TETRACTYS_INPUT_ID = "tetractys-input";
export const TETRACTYS_FORM_ID = "tetractys-form";

export const NUMBER_MAP = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
};

export const NEXT_POINT_MAP = {
  one: "two",
  two: "three",
  three: "four",
  four: "five",
  five: "six",
  six: "seven",
  seven: "eight",
  eight: "nine",
  nine: "ten",
  ten: null,
} as const;

const PLACEHOLDER_QUESTION = "question representing the first concept on the tetractys";

export const PLACEHOLDER_POINT = {
  question: PLACEHOLDER_QUESTION,
  quote: "quote from the answer",
  quoteAuthor: "author of the quote",
} as const;

export const PLACEHOLDER_ANSWER = "suggestion for the first concept on the tetractys";

export const LIPSUM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla pretium, elit nec consectetur sollicitudin, urna sapien elementum arcu, nec lobortis mauris ipsum ut diam. 

Nullam maximus, velit eu tempor suscipit, ex orci condimentum nunc, id dictum dolor lectus in ante. Suspendisse eget justo massa. Pellentesque elementum nulla ut elit blandit malesuada.`;

export const SYSTEM_PROMPT = `You are a wise teacher that uses questions to help the user find the answers they are looking for.
Consider user's past Q&As, strategies, and feedback when generating questions.`;

export const RESULT_DEVELOPER_PROMPT = `Based on the following questions and answers, generate a single paragraph of text.
Give the user a good place to start thinking about the answers they are looking for.`;

export const INITIAL_QUESTION: QandA = {
  question: "What are you looking for?",
  quote: "Trust the process.",
  quoteAuthor: "Tony Wroten",
};

export const CURRENCIES = ["usd", "eur", "gbp", "cad", "aud", "chf", "cny", "hkd", "inr", "mxn", "rub", "zar"] as const;

export const DEFAULT_PRICES = {
  usd: 0,
} as const;

export const CURRENCY_SYMBOLS = {
  usd: "$",
  eur: "€",
  gbp: "£",
  cad: "$",
  aud: "$",
  chf: "₣",
  cny: "¥",
  hkd: "HK$",
  inr: "₹",
  mxn: "$",
  rub: "₽",
} as const;

export const DEFAULT_LOCATION = "DEFAULT_LOCATION";
