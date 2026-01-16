const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/api/pyq", require("./routes/pyqRoutes"));
app.use("/api/notes", require("./routes/notesRoutes"));
app.use("/api/meta", require("./routes/metaRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));

//app.use("/api/auth", require("./routes/authRoutes"));

// Test route
app.get("/", (req, res) => {
  res.send("CampusConnect Backend Running");
});

const PORT = process.env.PORT || 5000;

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// 🔐 SOCKET AUTH (JWT)
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token"));

    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // { id, role }
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

// 🔁 SOCKET EVENTS
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.user.id);

  socket.on("join-post", (postId) => {
    socket.join(postId);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
});

// make io available to controllers
app.set("io", io);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



