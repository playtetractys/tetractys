import type { Stripe } from "stripe";
import type { Tetractys, User, QandA, UserProduct, UserService, UserRequest, UserOffering } from "@/services/types";
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
  user: User;

  /** Keyed by `{pushKey}` */
  tetractys: Tetractys;

  /** Keyed by `{pushKey}` */
  userProduct: UserProduct;

  /** Keyed by `{pushKey}` */
  userService: UserService;

  /** Keyed by `{pushKey}` */
  userRequest: UserRequest;

  /** Keyed by `{pushKey}` */
  userOffering: UserOffering;

  /** Keyed by `{tetractysKey}` */
  openAiRequest: {
    messages: [string, string][];
    point: Partial<QandA>;
  };

  /** Keyed by `{uid}` */
  editorState: { value: JSONContent };
};
