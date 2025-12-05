// backend/src/cron.js
import cron from "node-cron";
import { bucket, filesCol } from "./db.js";

/**
 * Every minute: delete all expired GridFS files (and their chunks).
 * Using bucket.delete() guarantees the chunks collection stays clean.
 */
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    // Find expired files
    const expired = await filesCol
      .find({ "metadata.expiresAt": { $lt: now } })
      .project({ _id: 1 })          // we only need the id
      .toArray();

    if (!expired.length) return;    // nothing to do

    // Delete each expired file + its chunks
    for (const { _id } of expired) {
      await bucket.delete(_id);
    }

    console.log(
      `[CRON] Removed ${expired.length} expired file(s) at ${now.toISOString()}`
    );
  } catch (err) {
    console.error("[CRON] Cleanup failed:", err);
  }
});
