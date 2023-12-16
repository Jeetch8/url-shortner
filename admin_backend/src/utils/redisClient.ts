import { createClient } from "redis";
import { env } from "./validateEnv";

export const redisClient = createClient({
  url: env.REDIS_DB_URL,
});

export const connectToRedis = async () => {
  redisClient.on("error", (err: any) =>
    console.log(`Redis client error ${err}`)
  );
  await redisClient.connect();
  console.log("Redis client connected");
};
