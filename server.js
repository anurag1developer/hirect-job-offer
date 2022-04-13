require("dotenv").config();
const express = require("express");
const app = express();

// User Auth Routes
const authRoutes = require("./routes/auth");

// Express middleware
// app.use("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use User Auth Routes
app.use("/auth", authRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running at port ${port}`));
