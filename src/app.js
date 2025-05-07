const express = require("express");

const app = express();

app.use((req, res) => {
  res.send("Hello From The server 3000");
});

app.listen(3000, () => {
  console.log("App Listening");
});
