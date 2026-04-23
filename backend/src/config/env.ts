import dotenv from "dotenv";

dotenv.config({ quiet: true });

const getEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const ENV = {
  PORT: Number(process.env.PORT) || 3000,
  DATABASE_URL: getEnv("DATABASE_URL"),
  NODE_ENV: process.env.NODE_ENV || "development",
  FRONTEND_URL: getEnv("FRONTEND_URL"),
  CLERK_PUBLISHABLE_KEY: getEnv("CLERK_PUBLISHABLE_KEY"),
  CLERK_SECRET_KEY: getEnv("CLERK_SECRET_KEY"),
  RAZORPAY_KEY_ID: getEnv("RAZORPAY_KEY_ID"),
  RAZORPAY_KEY_SECRET: getEnv("RAZORPAY_KEY_SECRET"),
};