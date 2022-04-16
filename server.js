require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

// database connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(err));

// User Auth Routes
const authRoutes = require("./routes/auth");
// Shop Routes
const shopRoutes = require("./routes/shop");

// Express middleware
// app.use("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use User Auth Routes
app.use("/auth", authRoutes);
// Use Shop Routes
app.use("/shop", shopRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running at port ${port}`));
