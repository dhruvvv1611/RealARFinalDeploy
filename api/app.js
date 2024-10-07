import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import modelsRoute from "./routes/model.route.js";
import panoramicRoute from "./routes/panorama.route.js";

const app = express();

// Middleware setup
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })); // CORS settings
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

// Route setup
app.use("/api/auth", authRoute);       // Authentication routes
app.use("/api/users", userRoute);       // User management routes
app.use("/api/posts", postRoute);       // Post management routes
app.use("/api/test", testRoute);        // Test routes
app.use("/api/chats", chatRoute);       // Chat functionality
app.use("/api/messages", messageRoute); // Message functionality
app.use("/api/models", modelsRoute);    // 3D model routes
app.use("/api/panoramic", panoramicRoute);

// Start the server
app.listen(8800, () => {
  console.log("Server is running!");
});
