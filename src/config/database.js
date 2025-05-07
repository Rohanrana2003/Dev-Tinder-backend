const mongoose = require("mongoose");

async function dbConnect() {
  await mongoose.connect(
    "mongodb+srv://Rohanrana2003:Rohan%400274@node.qf4mfrd.mongodb.net/devTinder"
  );
}

module.exports = dbConnect;
