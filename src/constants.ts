export const isSsr = typeof window === "undefined";

export const isProd = process.env.NODE_ENV === "production";
