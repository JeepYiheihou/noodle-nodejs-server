"use strict";

const express = require("express");
const router = express.Router();
const commodityController = require("../controllers/commodity_controller");

/* Create commodity entry. */
router.post("/create", commodityController.create);

/* Get a commodity by commodity id. */
router.get("/id/:id", commodityController.findById);

/* Get commodities by video content id. */
router.get("/find-by-content/:id", commodityController.findByContentId);

/* Update commodity with id. */
router.put("/id/:id", commodityController.update);

/* Delete commodity entry. */
router.delete("/id/:id", commodityController.delete);

module.exports = router;
