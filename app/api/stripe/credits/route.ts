import { NextResponse } from "next/server";
import Stripe from "stripe";

// Services
import { verifyAuth } from "@/services/verify-auth";
import { initializeBackendApp } from "@/soil/services/firebase-admin";

// Types
import type { CreditsRequest } from "@/services/types";

initializeBackendApp();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const authResponse = await verifyAuth(request);
    if (authResponse instanceof Error || !authResponse.uid) {
      return NextResponse.json({ error: authResponse.message }, { status: 401 });
    }

    const { amount, redirectPathname } = (await request.json()) as CreditsRequest;

    const cents = amount * 100;
    // Each credit costs 10 cents
    const credits = amount * 10;

    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Tetractys Credits",
            description: "Fully refundable credits for Tetractys",
          },
          unit_amount: cents,
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Platform Fee",
            description: "This helps cover the cost of maintaining and growing the platform",
          },
          unit_amount: Math.max(Math.round(cents * 0.04), 50),
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      client_reference_id: authResponse.uid,
      line_items,
      mode: "payment",
      success_url: `${request.headers.get("origin")}${redirectPathname}`,
      cancel_url: `${request.headers.get("origin")}${redirectPathname}`,
      metadata: { credits },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error creating checkout session" },
      { status: 500 }
    );
  }
}
