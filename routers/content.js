const express = require("express");
const { prisma } = require("../prismaClient");
const router = express.Router();

router.get("/posts", async (req, res) => {
  try {
    const data = await prisma.post.findMany({
      include: {
        user: {
          include: {
            password: false,
          },
        },
        comments: true,
      },
      orderBy: { id: "desc" },
      take: 20,
    });
    res.status(200).json({ data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }
});

router.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await prisma.post.findFirst({
      where: { id: Number(id) },
      include: {
        user: {
          include: {
            password: false,
          },
        },
        comments: {
          include: {
            user: {
              include: {
                password: false,
              },
            },
          },
        },
      },
    });
    res.status(200).json({ data });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.comment.deleteMany({
    where: { postId: Number(id) },
  });
  await prisma.post.delete({
    where: { id: Number(id) },
  });
  res.sendStatus(204);
});

router.delete("/comments/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.comment.delete({
    where: { id: Number(id) },
  });
  res.sendStatus(204);
});

module.exports = { contentRouter: router };
