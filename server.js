"user strict";

const Koa = require("koa");
const logger = require("koa-logger");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const createReadStream = require("fs").createReadStream;
const serve = require("koa-static");
const path = require("path");
const Message = require("./models");

const db = require("./db");
const app = new Koa();
const router = new Router();
const server = require("http").createServer(app.callback());
const io = require("socket.io")(server);

app.use(logger());

app.use(bodyParser());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit("error", err, ctx);
  }
});

app.use(router.routes()).use(router.allowedMethods());

app.use(serve(__dirname + "/frontend/build/"));

router.get("/", async (ctx, next) => {
  ctx.type = "html";
  ctx.body = createReadStream(
    path.join(__dirname, "/frontend/build/index.html")
  );
});

const port = process.env.PORT || 8000;

server.listen(port);
console.log("Server running on the port", port, "✅");

io.on("connection", socket => {
  socket.on("login", async (msg, fn) => {
    socket.nickname = msg.nickname;
    socket.loggedIn = msg.loggedIn;
    console.log(socket.nickname, "joined /nomadchat");
    const nomads = getConnected();
    const messages = await Message.find({});
    fn(messages);
    io.emit("room change", { connected: nomads });
  });
  socket.on("send message", async msg => {
    const message = await Message.create({
      user: socket.nickname,
      message: msg.message
    });
    if (message) {
      io.emit("new message", { newMessage: { message } });
    }
  });
  socket.on("disconnect", () => {
    console.log("somebody left /nomadchat");
    const nomads = getConnected();
    io.emit("room change", { connected: nomads });
  });
});

const getConnected = () => {
  const nomads = io.sockets.connected;
  const connected = [];
  for (let nomadId in nomads) {
    let nomad = io.sockets.connected[nomadId];
    if (nomad.loggedIn) connected.push(nomad.nickname);
  }
  return connected;
};
