import z from "zod";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SETLIST_FM_API_KEY: string;
      EXPO_PUBLIC_FASTIFY_SERVER_URL: string;
      EXPO_PUBLIC_SENTRY_DSN: string;
    }
  }
}

const envSchema = z.object({
  EXPO_PUBLIC_SETLIST_FM_API_KEY: z.string(),
  EXPO_PUBLIC_FASTIFY_SERVER_URL: z.string(),
  EXPO_PUBLIC_SENTRY_DSN: z.string(),
});

export const env = envSchema.parse({
  EXPO_PUBLIC_SETLIST_FM_API_KEY: process.env.EXPO_PUBLIC_SETLIST_FM_API_KEY,
  EXPO_PUBLIC_FASTIFY_SERVER_URL: process.env.EXPO_PUBLIC_FASTIFY_SERVER_URL,
  EXPO_PUBLIC_SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
});
