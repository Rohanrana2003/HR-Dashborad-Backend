const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/database");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");

app.use("/", authRouter);

dbConnect()
  .then(() => {
    console.log("Database connected Successfully");
    app.listen(5000, () => {
      console.log("App Listening");
    });
  })
  .catch((err) => console.error("Can't able to connect to Database"));
