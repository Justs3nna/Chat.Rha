const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://10.0.2.2:3000", // Configure this to your client's URL
    methods: ["GET", "POST"],
  }
  });

const PORT = 4000;

let chatgroups = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

io.on("connection", (socket) => {
  console.log(`${socket.id} user is just connected`);

  socket.on('getAllGroups', () => {
    socket.emit('groupList', chatgroups);
  });

  socket.on("createNewGroup", (currentGroupName) => {
    console.log(currentGroupName);
    chatgroups.unshift({
      id: chatgroups.length + 1,
      currentGroupName,
      messages: [],
    });
    // Emit the updated group list to all connected clients, including the one that created the group.
    io.emit('groupList', chatgroups);
  });
});

app.get("/api", (req, res) => {
  res.json(chatgroups);
});

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
