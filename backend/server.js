const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { addUser, getUser, removeUser } = require("./utils/users");
const app = express();

const server = http.createServer(app);
const io = new Server(server);

app.use(cors());

// app.use(cors({
//   origin: 'https://co-create-frontend.vercel.app/'
// }));

app.get("/", (req, res) => {
  res.send("This is realtime whiteboard sharing server");
});

let roomIdGlobal;
let imgURLGlobal;

io.on("connection", (socket) => {
  socket.on("userJoined", (data) => {
    const { name, userId, roomId, host, presenter } = data;
    roomIdGlobal = roomId;
    socket.join(roomId);
    const users = addUser({
      name,
      userId,
      roomId,
      host,
      presenter,
      socketId: socket.id,
    });
    socket.emit("userIsJoined", { success: true, users });
    socket.broadcast.to(roomId).emit("userJoinedMessageBroadcasted", name);
    socket.broadcast.to(roomId).emit("allUsers", users);
    socket.broadcast.to(roomId).emit("whiteboardDataResponse", {
      imgURL: imgURLGlobal,
    });
  });
  socket.on("whiteboardData", (data) => {
    imgURLGlobal = data;
    socket.broadcast.to(roomIdGlobal).emit("whiteboardDataResponse", {
      imgURL: data,
    });
  });

  socket.on("message", (data) => {
    const { message } = data;
    const user = getUser(socket.id);
    if (user) {
      socket.broadcast
        .to(roomIdGlobal)
        .emit("messageResponse", { message, name: user.name });
    }
  });
  socket.on("disconnect", (data) => {
    const user = getUser(socket.id);
    if (user) {
      removeUser(socket.id);
      socket.broadcast
        .to(roomIdGlobal)
        .emit("userLeftMessageBroadcasted", user.name);
    }
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () =>
  console.log(`Server is running on http://localhost:5000`)
);
