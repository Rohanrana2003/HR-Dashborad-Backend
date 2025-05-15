const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/database");

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://hr-dashboard-frontend-sbbf.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.options("*", cors()); // ✅ add this for preflight support

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const authRouter = require("./routes/auth");
const candidateRouter = require("./routes/candidates");
const employeeRouter = require("./routes/employee");
const attendanceRouter = require("./routes/attendance");
const leaveRouter = require("./routes/leave");

app.use("/", authRouter);
app.use("/", candidateRouter);
app.use("/", employeeRouter);
app.use("/", attendanceRouter);
app.use("/", leaveRouter);

dbConnect()
  .then(() => {
    console.log("Database connected Successfully");
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((err) => console.error("Can't connect to Database", err));
