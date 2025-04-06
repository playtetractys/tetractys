import { CURRENCIES } from "@/services/constants";

export type Currency = (typeof CURRENCIES)[number];

export type UserData = {
  email: string;
  createdAt: number;
  updatedAt?: number;
  inviteCode?: string | null;
};

/** Keyed by `{username}` */
export type Profile = {};

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

export type CreditsRequest = {
  amount: number;
  redirectPathname: string;
};

export type StoryPage = {
  image: string;
  imageAlt: string;
  photoCredit?: string;
  photoCreditLink?: string;
};

export type StoryStepButton = {
  text: string;
  primary?: boolean;
};

export type StoryStep = {
  text: string;
  audio?: string | null;
  /** Keyed by `{actionKey}` */
  buttons: Record<string, StoryStepButton>;
};

export type ImageData = {
  image: string;
  imageAlt: string;
  photoCredit?: string;
  photoCreditLink?: string;
};

export type LocationData = {
  name: string;
  primaryImageDataKey: string;
};

export type Tile = {};

export type Galaxy = LocationData & {
  defaultSectorKey: string;
  tiles: Record<string, Tile>;
};

export type Sector = LocationData & {
  tileKey: string;
  defaultStarKey: string;
  /** timestamp of when the jump point was built */
  jumpPointBuiltAt?: number;
  /** username of the use who built the jump point */
  jumpPointBuiltBy?: string;
};

export type BlackHole = {
  primaryImageDataKey: string;
};

export type Star = LocationData & {
  /** timestamp of when the dyson sphere was built */
  dysonSphereBuiltAt?: number;
  /** username of the use who built the dyson sphere */
  dysonSphereBuiltBy?: string;
};

export type Planet = LocationData & {
  orbitDistance: number;
  orbitSpeed: number;
  orbitDirection: number;
  /** timestamp of when the planet was built */
  planetBuiltAt?: number;
  /** username of the use who built the planet */
  planetBuiltBy?: string;
};

/** Farcasters are built by users so they can travel to planets accross the galaxy whenever they want */
export type Farcaster = {
  primaryImageDataKey: string;
};

export type TetractysAiPoint = {
  prompt: string;
  aiCredits: number;
};

/** A Tetractys is created at most once a day.
 * Then, then a cron job gets each
 * Keyed by `{uid}:~~:{YYYY-MM-DD}` */
export type Tetractys = {
  overallStrategy: TetractysAiPoint;
  militaryStrategy: TetractysAiPoint;
  economicStrategy: TetractysAiPoint;
  diplomaticStrategy: TetractysAiPoint;
  explorationStrategy: TetractysAiPoint;
  researchStrategy: TetractysAiPoint;
  developmentStrategy: TetractysAiPoint;
  eight: TetractysAiPoint;
  nine: TetractysAiPoint;
  ten: TetractysAiPoint;
};

export type UserState = {
  galaxyKey: string;
  sectorKey: string;
  starKey?: string | null;
  planetKey?: string | null;
  storyPageKey?: string | null;
  storyStepKey?: string | null;
  aiCredits: number;
  energy: number;
};

export type WaitListData = Record<string, { createdAt: number; successfulInvites: number }>;
