"user strict";

const Koa = require("koa");
const logger = require("koa-logger");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const convert = require("koa-convert");
const koaRes = require("koa-res");
const createReadStream = require("fs").createReadStream;
const serve = require("koa-static");
const path = require("path");

const db = require("./db");
const app = new Koa();
const router = new Router();

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

app.listen(port);
console.log("Server running on port", port, "✅");
