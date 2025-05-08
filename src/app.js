const express = require("express");
const dbConnect = require("./config/database");
const { validateSignUpData } = require("./utils/validation");
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const { authUser } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

// Saving User Data Dynamically
app.post("/signup", async (req, res) => {
  try {
    //Validation of data
    validateSignUpData(req);
    const { firstName, lastName, email, password } = req.body;

    // Hashing the password
    const passwordHash = await bcrypt.hash(password, 10);

    //Create a new instance of the user model
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    await user.save();
    res.send("Successfully saved User Details");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// Login API
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validating email
    if (!validator.isEmail(email)) {
      throw new Error("Please enter a valid mail");
    }

    // Checking user exists or not
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    // Comparing password
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // Creating a JWT token
      const token = user.getJWT();
      // Add the token to cookie andsend the response back
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login Successfull");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// Profile API
app.get("/profile", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error");
  }
});

// Send Request API
app.post("/sendconnectionrequest", authUser, (req, res) => {
  const { user } = req;
  res.send("Request sent by " + user.firstName);
});

dbConnect()
  .then(() => {
    console.log("Database connected Successfully");
    app.listen(3000, () => {
      console.log("App Listening");
    });
  })
  .catch((err) => console.error("Can't able to connect to Database"));
