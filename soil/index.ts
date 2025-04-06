import type { Stripe } from "stripe";
import type {
  UserData,
  QandA,
  UserState,
  StoryStep,
  StoryPage,
  Tetractys,
  Galaxy,
  Sector,
  Star,
  Planet,
} from "@/services/types";
import type { JSONContent } from "@tiptap/react";

export type SoilDatabase = {
  /** Keyed by `{uid}:~:{settingsKey}` */
  soilUserSettings: { value: string };

  /** Keyed by `{pushKey}` */
  soilFile: { downloadUrl: string };

  /** Keyed by `{paymentIntentId}` */
  stripePayment: {
    checkoutSession?: Stripe.Checkout.Session;
    charge?: Stripe.Charge;
    paymentIntent?: Stripe.PaymentIntent;
  };

  /** Keyed by `{uid}` */
  user: UserData;

  /** Keyed by `{tetractysKey}` */
  openAiRequest: {
    messages: [string, string][];
    point: Partial<QandA>;
  };

  /** Keyed by `{uid}` */
  editorState: { value: JSONContent };

  /** Keyed by `{uid}` */
  userState: UserState;

  /** Keyed by `{pushKey}` */
  storyPage: StoryPage;
  /** Keyed by `{pushKey}` */
  storyStep: StoryStep;

  /** Keyed by `{pushKey}` */
  tetractys: Tetractys;

  /** Keyed by `{pushKey}` */
  galaxy: Galaxy;

  /** Keyed by `{pushKey}` */
  sector: Sector;

  /** Keyed by `{pushKey}` */
  star: Star;

  /** Keyed by `{pushKey}` */
  planet: Planet;
};
