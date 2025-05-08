const express = require("express");
const dbConnect = require("./config/database");
const { validateSignUpData } = require("./utils/validation");
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
var jwt = require("jsonwebtoken");

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
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Checking password is right or wrong
    if (isPasswordValid) {
      // Creating a JWT token
      const token = jwt.sign({ _id: user.id }, "Rohan@0274");
      // Add the token to cookie andsend the response back
      res.cookie("token", token);
      res.send("Login Successfull");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// Profile API
app.get("/profile", async (req, res) => {
  const cookies = req.cookies;
  const { token } = cookies;
  if (!token) {
    throw new Error("Invalid Token");
  }

  const decodedMessage = jwt.verify(token, "Rohan@0274");

  const { _id } = decodedMessage;

  const user = await User.findById(_id);
  if (!user) {
    throw new Error("Invalid Credentials");
  }
  res.send(user);
});

// Finding a User by email ID
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const user = await User.find({ email: userEmail });

    if (user.length === 0) {
      res.status(404).send("Cannot find user");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// Deleting a User by ID
app.delete("/user", async (req, res) => {
  const userId = req.body.id;
  try {
    const data = await User.findByIdAndDelete(userId);
    if (data) {
      res.send("Deleted Successfully");
    } else {
      res.status(404).send("Error in deletion");
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// Updating a User by ID
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["age", "gender", "about", "photoUrl", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update is not allowed");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    if (user) {
      res.send("Updated Successfully");
    } else {
      res.status(404).send("Error in Updation");
    }
  } catch (err) {
    res.status(400).send("Updation Error, " + err.message);
  }
});

// Fetching all data of Users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("Cannot find any user");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.send(400).send("Something went wrong");
  }
});

dbConnect()
  .then(() => {
    console.log("Database connected Successfully");
    app.listen(3000, () => {
      console.log("App Listening");
    });
  })
  .catch((err) => console.error("Can't able to connect to Database"));
