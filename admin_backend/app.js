require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const port = 5000;
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

app.use(cors({ origin: "http://localhost:5173" }));
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1/user", require("./routes/user.routes"));
app.use("/api/v1/auth", require("./routes/auth.routes"));
app.use("/api/v1/url", require("./routes/shortner.routes"));

app.use(require("./middleware/not-found"));
app.use(require("./middleware/error-handler"));

const serverInit = async () => {
  try {
    await mongoose.connect(process.env.DB_URL).then(() => {
      console.log("DB Connection established");
    });
    app.listen(port, () => {
      console.log("server listening on " + port);
    });
  } catch (error) {
    console.log(error, "Server intialization failed");
  }
};

serverInit();
