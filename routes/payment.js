const express = require("express");
const { payMerchant } = require("../controllers/payment");
const router = express.Router();

//pay merchant route
router.post("/request/account/confirmation", payMerchant);

module.exports = router;
