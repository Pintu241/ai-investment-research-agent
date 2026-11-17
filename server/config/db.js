import mongoose from "mongoose";

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, memServer: null };
}

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const connectWithUri = async (uri) => {
    return mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2000
    });
  };

  if (!cached.promise) {
    cached.promise = (async () => {
      let uri = process.env.MONGO_URI;

      // If MONGO_URI is set, try connecting to it first
      if (uri) {
        try {
          const conn = await connectWithUri(uri);
          console.log("Connected to MongoDB successfully.");
          return conn;
        } catch (err) {
          console.warn(`Could not connect to configured MONGO_URI: ${err.message}`);
          console.log("Falling back to embedded in-memory MongoDB...");
        }
      }

      // Fallback: start embedded in-memory MongoDB instance
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      if (!cached.memServer) {
        cached.memServer = await MongoMemoryServer.create();
      }
      const memUri = cached.memServer.getUri();
      const conn = await connectWithUri(memUri);
      console.log(`Connected to in-memory MongoDB at: ${memUri}`);
      return conn;
    })();
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
};

export default connectDB;
