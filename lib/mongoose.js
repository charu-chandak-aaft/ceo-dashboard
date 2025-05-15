import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
console.log('MONGODB_URI', MONGODB_URI);
if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    //   if (cached.conn) return cached.conn;
    //   if (!cached.promise) {
    //     cached.promise = mongoose.connect(MONGODB_URI, {
    //       useNewUrlParser: true,
    //       useUnifiedTopology: true,
    //     }).then((mongoose) => mongoose);
    //   }
    //   cached.conn = await cached.promise;
    //   return cached.conn;
    mongoose.connect(MONGODB_URI, {})
        .then((con) => {
            console.log(`Database connected with host: ${con.connection.host} on port: ${con.connection.port}`);
        })
        .catch((err) => {
            console.log(`Database connection error: ${err}`);
        })
}

export default connectToDatabase;
