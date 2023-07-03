const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const socket_io = require("socket.io");
const checker = require("bad-words");
const { generatedAtMessage, genereatedLocMessage } = require("./utils/gen");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const puplic = path.join(__dirname, "../puplic");
const PORT = process.env.PORT;
const Server = http.createServer(app);
const io = socket_io(Server);
app.use(express.static(puplic));

io.on("connection", (socket) => {
  console.log("new websocket connsection");

  socket.on("join", (options, callback) => {
    //checking for the user joinging the room
    const { error, user } = addUser({ id: socket.id, ...options });

    // in case of error stop the porcess of joining the room
    if (error) {
      return callback(error);
    }

    // creating socket room for users who joined in
    socket.join(user.room);
    socket.emit("Message", generatedAtMessage("Welcome"));
    socket.broadcast
      .to(user.room)
      .emit("Message", generatedAtMessage(`${user.username} has Joined in `));
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  socket.on("SendMessage", (message, callback) => {
    const filter = new checker();

    const user = getUser(socket.id);

    if (filter.isProfane(message)) {
      return callback("profanity is not allowed");
    }
    // server emitting the event to every one
    io.to(user.room).emit(
      "Message",
      generatedAtMessage(user.username, message)
    );
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "Message",
        generatedAtMessage(`${user.username} has left !`)
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });

  socket.on("Location", (coords, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "locationMessage",

      genereatedLocMessage(
        user.username,
        `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );

    callback();
  });
});

Server.listen(PORT, () => {
  console.log("here we go again");
});
