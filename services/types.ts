import { CURRENCIES } from "@/services/constants";

export type Currency = (typeof CURRENCIES)[number];

export type User = {
  email: string;
  currentCollection?: string;
  // Keyed by {tetractysKey}
  tetractysHistory?: Record<string, string>;
};

export type QandA = {
  question: string;
  quote: string;
  quoteAuthor: string;
  answer?: string;
};

export type QandAProps = QandA & {
  placeholder?: string;
  btnText: string;
  handler: (e?: React.FormEvent<HTMLFormElement>) => Promise<void>;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
};

export type TetractysPoints = {
  one: QandA;
  two?: QandA;
  three?: QandA;
  four?: QandA;
  five?: QandA;
  six?: QandA;
  seven?: QandA;
  eight?: QandA;
  nine?: QandA;
  ten?: QandA;
};

/** Keyed by `{pushKey}` */
export type Tetractys = {
  points?: TetractysPoints;
  result?: string;
};

export type CreditsRequest = {
  amount: number;
  redirectPathname: string;
};

export type Credits = {
  amount: number;
};

export type ProductOrService = {
  name: string;
  description: string;
  prices: Partial<Record<Currency, number>>;
};

export type UserProduct = ProductOrService;

export type UserService = ProductOrService;

export type UserRequest = {
  ttl: number;
};

export type UserOffering = {
  ttl: number;
};

export type OfferingType = "product" | "service";
