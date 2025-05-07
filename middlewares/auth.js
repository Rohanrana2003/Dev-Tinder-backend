const authUser = (req, res, next) => {
  const token = "xyz";
  const isAuthorized = token === "xyz";
  console.log("Checking Authorization");
  if (!isAuthorized) {
    res.status(401).send("Unauthorized Request");
    console.log("Not Authorized");
  } else {
    next();
    console.log("Success");
  }
};

module.exports = { authUser };
