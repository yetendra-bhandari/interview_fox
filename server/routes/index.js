const router = require("express").Router();

router.use("/api", require("./api"));

router.all("/", (req, res) => {
  res.send("Interview_Fox");
});

module.exports = router;
