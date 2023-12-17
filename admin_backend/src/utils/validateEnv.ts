import { cleanEnv, port, str, url } from "envalid";

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ default: "development" }),
  PORT: port({ default: 5000 }),
  base_url: url(),
  FRONTEND_ORIGIN_URL: url(),
  DB_URL: str(),
  JWT_SECRET: str(),
  JWT_LIFETIME: str(),
  CLOUDINARY_CLOUD_NAME: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_API_SECRET: str(),
  LOG_DIR: str(),
  REDIS_DB_URL: url(),
  GOOGLE_CLIENT_ID: str(),
  GOOGLE_CLIENT_SECRET: str(),
  GOOGLE_CALLBACK_URL: url(),
  GITHUB_CLIENT_ID: str(),
  GITHUB_CLIENT_SECRET: str(),
  GITHUB_CALLBACK_URL: url(),
});
