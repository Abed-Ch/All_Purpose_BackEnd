const express = require("express");
const router = express.Router();
const {
  getPantry,
  updatePantry,
  printCart,
} = require("../controller/Pantry.controller");

router.get("/", getPantry);

router.patch("/", updatePantry);

router.post("/", printCart);

module.exports = router;
