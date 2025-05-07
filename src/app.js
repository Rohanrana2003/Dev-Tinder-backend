const express = require("express");

const app = express();

// app.get("/user", (req, res) => {
//   res.send("HAHAHAHA");
// });

app.get("/user", (req, res) => {
  res.send({ FirstName: "Rohan", LastName: "Rana" });
});

app.post("/user", (req, res) => {
  res.send("Data updated  Successfully");
});

app.delete("/user", (req, res) => {
  res.send("Deleted Successfully");
});

app.listen(3000, () => {
  console.log("App Listening");
});
