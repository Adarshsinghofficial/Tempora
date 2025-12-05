# Tempora 

A lightweight “temporary cloud” for one‐off file sharing—no login required.  
Users upload any file via REST or web UI, choose a TTL (10, 20 or 30 min), and get a unique 4-character code. Anyone with that code can download until it expires and is auto-deleted.

---

## Features

- **Upload & Download**  
  - REST endpoints (`/upload`, `/file/:code`)  
  - React + Vite frontend  
- **Automatic Expiry**  
  - Cron-worker script deletes expired GridFS files & chunks every minute  
- **Tech Stack**  
  - **Backend:** Node.js (ESM) + Express  
  - **Storage:** MongoDB Atlas + GridFS  
  - **Frontend:** React, Vite, Tailwind CSS  
