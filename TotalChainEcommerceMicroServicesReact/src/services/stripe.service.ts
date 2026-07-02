import { environment } from "../environments/environment";

export const createCheckoutSession = async (
  orderId: number | null,
  amount: number,
  currency: string,
  customerEmail: string
): Promise<void> => {
  const token = localStorage.getItem("token");
  const authStorageStr = localStorage.getItem("auth-storage");
  let finalToken = token;

  if (!finalToken && authStorageStr) {
    try {
      const authStorage = JSON.parse(authStorageStr);
      finalToken = authStorage.state?.token || null;
    } catch {
      // ignore
    }
  }

  const response = await fetch(`${environment.urlAPI}payments/create-checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${finalToken}`,
    },
    body: JSON.stringify({
      Amount: amount,
      Currency: currency,
      UserEmail: customerEmail,
      OrderId: orderId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error creating checkout session");
  }

  const data = await response.json();
  const sessionUrl = data?.data?.SessionUrl || data?.SessionUrl;

  if (sessionUrl) {
    // Add order_id to cancel_url if not already present and orderId exists
    const checkoutUrl = new URL(sessionUrl, window.location.origin);
    if (orderId && !checkoutUrl.searchParams.has("order_id")) {
      checkoutUrl.searchParams.set("order_id", orderId.toString());
    }
    window.location.href = checkoutUrl.toString();
  } else {
    throw new Error("No checkout URL returned");
  }
};

export const confirmPayment = async (sessionId: string): Promise<number> => {
  const token = localStorage.getItem("token");
  const authStorageStr = localStorage.getItem("auth-storage");
  let finalToken = token;

  if (!finalToken && authStorageStr) {
    try {
      const authStorage = JSON.parse(authStorageStr);
      finalToken = authStorage.state?.token || null;
    } catch {
      // ignore
    }
  }

  const response = await fetch(`${environment.urlAPI}payments/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${finalToken}` },
    body: JSON.stringify({ SessionId: sessionId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Payment confirmation failed");
  }

  const data = await response.json();
  const orderId = data?.data?.orderId || data?.data?.OrderId || data?.orderId || data?.OrderId;
  if (!orderId) throw new Error("No order ID returned");
  return orderId;
};
