const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const { prisma } = require("./prismaClient");
const { contentRouter } = require("./routers/content");
const { userRouter } = require("./routers/user");

app.get("/info", (req, res) => {
  res.json({msg: "Express API"});
})

app.use("/", userRouter);
app.use("/contents", contentRouter);

const server = app.listen(8000, () => {
  console.log("Express API started at 8000...");
})

const gracefulShutdown = async () => {
  await prisma.$disconnect();
  server.close(() => {
    console.log("API closed...");
    process.exit(0);
  })
}

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
