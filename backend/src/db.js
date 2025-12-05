import { MongoClient, GridFSBucket } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();

export const db       = client.db(process.env.DB_NAME || "filewala");
export const bucket   = new GridFSBucket(db, { bucketName: "uploads" });
export const filesCol = db.collection("uploads.files");
