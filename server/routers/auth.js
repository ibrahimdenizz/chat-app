const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const router = require("express").Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error)
    return res.status(400).send({
      path: error.details[0].path[0],
      message: error.details[0].message,
    });

  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user)
      return res.status(404).send({ path: "top", message: "User not found" });

    const check = await bcrypt.compare(req.body.password, user.password);

    if (!check)
      return res
        .status(400)
        .send({ path: "password", message: "Password is incorrect" });

    res
      .status(200)
      .send({ username: user.username, message: "User successfully login" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ path: "top", message: err.message });
  }
});

module.exports = router;
