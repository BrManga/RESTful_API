const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
mongoose.connect(
  "mongodb+srv://Bora_Manga:" +
    process.env.MONGO_ATLAS_PW +
    "@cluster0-linf1.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
//MIDDLEWARES
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CORS SETUP-------------------------------------------
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); //Which adresses to allow to reach our API
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  ); //Which headers to send with request

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});
//------------------------------------------------------
//ROUTES
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

//ERROR HANDLING-----------------
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  console.log(error.message);
  res.json({
    error: {
      message: error.message
    }
  });
});
//-----------------------------------
module.exports = app;
