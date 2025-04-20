import express from "express";
import http from "http"; // Import HTTP module
import { Server } from "socket.io";
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
import { getGeminiResponse } from "./gemini.js";
import path from "path";

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const _dirname = path.resolve();

// Middleware setup
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/test", testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.use("/api/models", modelsRoute);
app.use("/api/panoramic", panoramicRoute);

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  const response = await getGeminiResponse(message);
  res.json({ reply: response });
});

// Socket.IO Logic
let onlineUser = [];

// Manage users for socket.io
const addUser = (userId, socketId) => {
  const userExits = onlineUser.find((user) => user.userId === userId);
  if (!userExits) {
    onlineUser.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle new user event
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    console.log("User added:", userId, socket.id);
  });

  // Handle send message event
  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
    }
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("User disconnected:", socket.id);
  });
});

app.use(express.static(path.join(_dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(_dirname, "client", "dist", "index.html"));
});

// Start the server
server.listen(8800, () => {
  console.log("Server is running on port 8800!");
});
