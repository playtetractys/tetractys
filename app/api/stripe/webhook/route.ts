// Services
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { set, initializeBackendApp, transactionWithCb } from "@/soil/services/firebase-admin";
import { createData, getDataKeyValue, updateData } from "@/soil/services/server-data";
import { Credits } from "@/services/types";

initializeBackendApp();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  let event: Stripe.Event | undefined;

  try {
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    await set(`stripeWebhookEvents/${event.type.replace(/\./g, "-")}/${event.id}`, event);

    if (
      event.type === "checkout.session.completed" &&
      event.data.object.client_reference_id &&
      event.data.object.payment_intent &&
      event.data.object.amount_total
    ) {
      const uid = event.data.object.client_reference_id;

      const paymentIntentId =
        typeof event.data.object.payment_intent === "string"
          ? event.data.object.payment_intent
          : event.data.object.payment_intent.id;

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      await createData({
        dataType: "stripePayment",
        dataKey: paymentIntentId,
        data: { checkoutSession: event.data.object, paymentIntent },
        owners: [uid],
        readOnly: true,
      });

      const credits = Number(event.data.object.metadata?.credits);
      if (credits) {
        await transactionWithCb<Credits>(`credits/${uid}`, (currentCredits) => {
          return { amount: (currentCredits?.amount ?? 0) + credits };
        });
      }
    } else if (
      (event.type === "charge.succeeded" ||
        event.type === "charge.captured" ||
        event.type === "charge.expired" ||
        event.type === "charge.failed" ||
        event.type === "charge.pending" ||
        event.type === "charge.refunded" ||
        event.type === "charge.updated") &&
      event.data.object.payment_intent
    ) {
      const paymentIntentId =
        typeof event.data.object.payment_intent === "string"
          ? event.data.object.payment_intent
          : event.data.object.payment_intent.id;

      const existingPayment = await getDataKeyValue("stripePayment", paymentIntentId);
      if (!existingPayment) return;

      await updateData({
        dataType: "stripePayment",
        dataKey: paymentIntentId,
        data: { charge: event.data.object },
      });
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(`❌ Error message: ${err.message}`);
      return NextResponse.json({ success: false, error: err.message });
    }

    throw err;
  }

  return NextResponse.json({ success: true, message: "Success!" });
}
