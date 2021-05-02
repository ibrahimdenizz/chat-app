const bcrypt = require("bcrypt");
const router = require("express").Router();
const { User, validate } = require("../models/user");

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password -__v");
    res.status(200).send(users);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: "Something goes wrong" });
  }
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error)
    return res.status(400).send({
      path: error.details[0].path[0],
      message: error.details[0].message,
    });

  const check = await User.findOne({ username: req.body.username });

  if (check)
    return res
      .status(400)
      .send({ path: "top", message: "User already registered" });

  const saltRounds = 10;

  const hash = await bcrypt.hash(req.body.password, saltRounds);
  try {
    const user = new User({ username: req.body.username, password: hash });
    await user.save();

    res.status(200).send({ message: "User successfully registered " });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ path: "top", message: err.message });
  }
});

module.exports = router;
