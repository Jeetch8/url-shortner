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
});
