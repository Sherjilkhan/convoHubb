import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth_route.js";
import messageRoutes from "./routes/message_route.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";
dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// ✅ Allow CORS only in development
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "frontend", "dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  connectDB();
});
