import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rccg_schedule';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Helper function to check connection status
export async function checkDatabaseConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    await connectToDatabase();
    const state = mongoose.connection.readyState;
    
    if (state === 1) {
      return { connected: true, message: '✅ MongoDB connected successfully!' };
    } else if (state === 2) {
      return { connected: false, message: '⏳ MongoDB connecting...' };
    } else if (state === 3) {
      return { connected: false, message: '❌ MongoDB disconnecting...' };
    } else {
      return { connected: false, message: '❌ MongoDB not connected' };
    }
  } catch (error) {
    return { 
      connected: false, 
      message: `❌ MongoDB connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}