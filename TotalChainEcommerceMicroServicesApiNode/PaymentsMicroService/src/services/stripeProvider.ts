import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
import stripe from "../core/config/stripeConfig";
import { IStripeProvider, StripeSessionResult } from "./interfaces/IStripeProvider";
export class StripeProvider implements IStripeProvider {
  async createCheckoutSession(
    items: { name: string; quantity: number; price: number }[],
    successUrl: string,
    cancelUrl: string,
    customerEmail?: string
  ): Promise<StripeSessionResult> {
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl || process.env.STRIPE_SUCCESS_URL || "",
      cancel_url: cancelUrl || process.env.STRIPE_CANCEL_URL || "",
      customer_email: customerEmail,
    });
    return {
      id: session.id,
      url: session.url,
      paymentIntentId: session.payment_intent as string || null,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total || 0,
      currency: session.currency || "eur",
      customerEmail: session.customer_details?.email || null,
    };
  }
  async retrieveSession(sessionId: string): Promise<StripeSessionResult> {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });
    return {
      id: session.id,
      url: session.url,
      paymentIntentId: (session.payment_intent as Stripe.PaymentIntent)?.id || null,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total || 0,
      currency: session.currency || "eur",
      customerEmail: session.customer_details?.email || null,
    };
  }
}
export default new StripeProvider();
