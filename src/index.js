const express = require("express");
const cors = require("cors");
const path = require("path");
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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authRouter = require("./routes/auth");
const candidateRouter = require("./routes/candidates");
const employeeRouter = require("./routes/employee");
const attendanceRouter = require("./routes/attendance");
const leaveRouter = require("./routes/leave");
const resumeRoutes = require("./routes/resume");

app.use("/", authRouter);
app.use("/", candidateRouter);
app.use("/", employeeRouter);
app.use("/", attendanceRouter);
app.use("/", leaveRouter);
app.use("/api", resumeRoutes);

dbConnect()
  .then(() => {
    console.log("Database connected Successfully");
    app.listen(5000, () => {
      console.log("App Listening");
    });
  })
  .catch((err) => console.error("Can't able to connect to Database"));
