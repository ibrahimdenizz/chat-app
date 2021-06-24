const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");
const cors = require("cors");
const config = require("config");

const corsOptions = {
  origin: config.get("url"),
  optionSuccessStatus: 200,
};

module.exports = function (app) {
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(cors(corsOptions));
};
