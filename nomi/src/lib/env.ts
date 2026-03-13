import { z } from "zod";

const envSchema = z.object({
  VITE_APP_ENV: z.enum(["development", "staging", "production"]).optional(),
  VITE_API_BASE_URL: z.string().optional(),
  VITE_AI_PROVIDER: z.enum(["claude", "openai", "mock"]).optional(),
  VITE_AI_MODEL: z.string().optional(),
  VITE_LOG_ENDPOINT: z.string().optional(),
  VITE_MONITORING_ENABLED: z.enum(["true", "false"]).optional(),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success && import.meta.env.DEV) {
  console.warn("[env] invalid configuration", parsed.error.flatten());
}

export const env = parsed.success ? parsed.data : ({} as z.infer<typeof envSchema>);

export function isMonitoringEnabled() {
  return env.VITE_MONITORING_ENABLED === "true";
}

export function getAppEnv() {
  return env.VITE_APP_ENV ?? "development";
}

export function isProduction() {
  return getAppEnv() === "production";
}
