const express = require("express");
const dbConnect = require("./config/database");
const app = express();

const User = require("./models/user");

app.use(express.json());

// Saving User Data Dynamically
app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("Successfully saved User Details");
  } catch (err) {
    res.status(400).send("Error in saving User Details, " + err.message);
  }
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
app.patch("/user", async (req, res) => {
  const userId = req.body.id;
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    if (user) {
      res.send("Updated Successfully");
    } else {
      res.status(404).send("Error in Updation");
    }
  } catch (err) {
    res.status(400).send("Updation Error" + err.message);
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
