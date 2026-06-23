import mongoose from "mongoose";

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Put, MONGO_URI in the .env");
  }
  return uri;
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  interface Window {
    mongooseCache?: MongooseCache;
  }
}

const globalContext = globalThis as typeof globalThis & { mongooseCache?: MongooseCache };

const cached: MongooseCache = globalContext.mongooseCache ?? {
  conn: null,
  promise: null,
};

globalContext.mongooseCache = cached;

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(getMongoUri(), opts).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error: unknown) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;