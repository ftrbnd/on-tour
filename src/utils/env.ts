import z from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_SETLIST_FM_API_KEY: z.string(),
  EXPO_PUBLIC_SPOTIFY_CLIENT_ID: z.string(),
  EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
