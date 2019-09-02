const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

let userCount = 0;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/message", (req, res) => {
  res.sendFile(__dirname + "/message.html");
});

app.get("/ozel", (req, res) => {
  res.sendFile(__dirname + "/ozel.html");
});

app.get("/ozelClient", (req, res) => {
  res.sendFile(__dirname + "/ozelClient.html");
});

const name = io.of("/özel").on("connection", client => {
  name.emit("message", client.id, " Joined to the room.");
  client.on("sendMessageToOzel", (from, message) => {
    name.emit("message", from, message);
  });
});

io.on("connection", client => {
  client.join("oda", () => {
    let rooms = Object.keys(client.rooms);
    io.emit(rooms[0], "SERVER", "You are in to 'oda'.");
    console.log(client.rooms);
    console.log(`${rooms[0]} -> client bağlandı.(${userCount})`);
    userCount++;
  });

  client.on("sendMessageToOda", (from, message) => {
    io.emit("oda", from, message);
  });
});

app.get("/test", (req, res) => {
  var message = req.param("message");
  var username = req.param("username");
  console.log(message);
  //   io.emit("chat message", "test");
  //   io.emit("connectToRoom",)
  io.emit("oda", username, message);
  res.send({ status: "Okey" });
});

io.serveClient(false);

server.listen(3000, () => {
  console.log(`listining localhost:3000`);
});
