import { env } from "../lib/env";

type LogPayload = Record<string, unknown>;

export async function logEvent(event: string, payload: LogPayload) {
  const endpoint = env.VITE_LOG_ENDPOINT;
  const data = {
    event,
    payload,
    timestamp: new Date().toISOString(),
  };

  if (!endpoint) {
    if (import.meta.env.DEV) {
      console.info("[NOVA Log]", data);
    }
    return;
  }

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
      navigator.sendBeacon(endpoint, blob);
      return;
    }

    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("[NOVA Log] Failed", error);
    }
  }
}
