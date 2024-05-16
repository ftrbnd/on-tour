import z from "zod";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SETLIST_FM_API_KEY: string;
      EXPO_PUBLIC_SPOTIFY_CLIENT_ID: string;
      EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET: string;
      EXPO_PUBLIC_FASTIFY_SERVER_URL: string;
    }
  }
}

const envSchema = z.object({
  EXPO_PUBLIC_SETLIST_FM_API_KEY: z.string(),
  EXPO_PUBLIC_SPOTIFY_CLIENT_ID: z.string(),
  EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET: z.string(),
  EXPO_PUBLIC_FASTIFY_SERVER_URL: z.string(),
});

export const env = envSchema.parse(process.env);
