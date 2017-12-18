"user strict";

const Koa = require("koa");
const logger = require("koa-logger");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const createReadStream = require("fs").createReadStream;
const serve = require("koa-static");
const path = require("path");

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

const port = process.env.PORT || 3000;

server.listen(port);
console.log("Server running on the port", port, "✅");

io.on("connection", socket => {
  console.log(socket.id, "connected");

  socket.on("login", msg => {
    socket.nickname = msg;
    console.log(socket.nickname, "joined /nomadchat");
    const nomads = getConnected();
    io.emit("room change", { connected: nomads });
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
    connected.push(nomad.nickname);
  }
  return connected;
};
