import mongoose from 'mongoose';
import { env } from '../utils/validateEnv';

export const ConnectMongoDb = async () => {
  try {
    await mongoose
      // .connect('mongodb://localhost:27017/url_shortner')
      .connect(env.DB_URL, {
        tls: true,
      })
      .then(() => {
        console.log('MongoDB Connection established');
      })
      .catch((err) => console.log(err));
    if (env.NODE_ENV === 'development') {
      // mongoose.set("debug", true);
    }
  } catch (error) {
    console.log(error, 'error');
    // process.exit(1);
  }
};
