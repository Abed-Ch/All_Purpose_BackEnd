require("dotenv").config();

const cors = require("cors");
const express = require("express");

const app = express();

app.use(cors());
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/pantry", require("./routes/pantry.routes"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("listening on port 3000");
});
