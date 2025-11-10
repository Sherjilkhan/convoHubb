import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth_route.js";
import messageRoutes from "./routes/message_route.js";
import cors from "cors"; 
import { app, server} from "./lib/socket.js";
import path from "path"
dotenv.config();
  
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();
app.use(express.json({limit:'100mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

const allowedOrigin = process.env.NODE_ENV === 'production' 
    ? 'https://convohub-pby8.onrender.com' // Replace with your actual deployed URL
    : 'http://localhost:5173';

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


  app.use(express.static(path.join(__dirname, "../frontend/dist")))
  app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend", "dist","index.html"))
  });

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectDB();
});
 