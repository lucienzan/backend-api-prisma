const express = require("express");
const { prisma } = require("../prismaClient");
const router = express.Router();
const bcrypt = require("bcrypt");

// request data type format
router.use(express.urlencoded({extended:true}));

router.get("/users", async (req, res) => {
  try {
    const data = await prisma.user.findMany({
      include: {
        posts: {
          take: 6,
        },
        comments: true
      }
    });
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.get("/users/:id", async (req, res) => {
  const {id} = req.params;
  try {
    const data = await prisma.user.findFirst({
      where: { id: Number(id) },
      include: {
        password: false,
        posts: {
          take: 6,
        },
        comments: true
      }
    });
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.post("/users", async (req, res) => {
  const { name, username, password, bio } = req.body;
  if (!name || !username || !password) {
    return res.status(400).json({ error: "Name, Username and Password fields are required." });
  }
  try {
    const hashpwd = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data:{name, username, password: hashpwd, bio}
    });
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});


module.exports = {userRouter: router}

