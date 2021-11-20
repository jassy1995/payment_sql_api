const express = require("express");
const app = express();
const cors = require("cors");
const paymentRoute = require("./routes/payment");
const process = require("process");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/payment", paymentRoute);
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
