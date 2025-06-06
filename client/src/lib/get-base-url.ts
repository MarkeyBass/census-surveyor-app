import { AppEnvType } from "@/types/general";

export const getBaseUrl = (): string => {
  console.log("getBaseUrl Logs", {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    INTERNAL_API_BASE_URL: process.env.INTERNAL_API_BASE_URL,
  });
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV as AppEnvType;
  if (!appEnv) {
    throw new Error("Environment variable NEXT_PUBLIC_APP_ENV is required but not defined.");
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const dockerComposeInternalBaseUrl =
    process.env.INTERNAL_API_BASE_URL || "http://server:8000/api/v1";

  if (!baseUrl) {
    throw new Error("Environment variable NEXT_PUBLIC_API_URL is required but not defined.");
  }

  if (appEnv === "development") {
    return typeof window === "undefined" ? dockerComposeInternalBaseUrl : baseUrl;
  }

  if (appEnv === "production") {
    return baseUrl;
  }

  throw new Error(
    `Invalid NEXT_PUBLIC_APP_ENV value "${appEnv}". Must be either "development" or "production".`
  );
};
