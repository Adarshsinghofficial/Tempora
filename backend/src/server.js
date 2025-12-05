import express from "express";
import cors from "cors";
import multer from "multer";
import crypto from "crypto";
import dotenv from "dotenv";
import { bucket, filesCol } from "./db.js";
import "./cron.js";    // starts the scheduled cleanup

dotenv.config();
const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

function genCode() {
  // Always 4 alphanumeric chars
  return crypto.randomBytes(3).toString("base64url").slice(0, 4);
}

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const ttlMinutes = Number(req.body.ttl) || 10; // 10 / 20 / 30
    const code = genCode();
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      metadata: {
        code,
        expiresAt,
        mime: req.file.mimetype
      }
    });
    uploadStream.end(req.file.buffer);

    uploadStream.once("finish", () => {
      res.json({ code, expiresAt });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.get("/file/:code", async (req, res) => {
  try {
    const doc = await filesCol.findOne({ "metadata.code": req.params.code });
    if (!doc) return res.status(404).json({ error: "Invalid code" });

    if (doc.metadata.expiresAt < new Date())
      return res.status(410).json({ error: "File expired" });

    res.setHeader("Content-Type", doc.metadata.mime);
    bucket.openDownloadStream(doc._id).pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Download failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`fileWala API listening on http://localhost:${PORT}`)
);
