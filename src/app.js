const express = require("express");
const dbConnect = require("./config/database");
// const { validateSignUpData } = require("./utils/validation");
const app = express();
const cors = require("cors");
// const User = require("./models/user");
// const bcrypt = require("bcrypt");
// const validator = require("validator");
const cookieParser = require("cookie-parser");
// const { authUser } = require("./middlewares/auth");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

dbConnect()
  .then(() => {
    console.log("Database connected Successfully");
    app.listen(3000, () => {
      console.log("App Listening");
    });
  })
  .catch((err) => console.error("Can't able to connect to Database"));
