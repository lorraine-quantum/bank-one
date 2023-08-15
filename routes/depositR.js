const route = require("express").Router();
const auth = require('../middleware/authentication')
route.use(auth)
const {
  addDeposit, getDeposits, getUser, getSingleDeposit
} = require("../controllers/deposit");

route.post("/add", addDeposit);
route.get("/token-user", getUser);
route.get("/single/:id", getSingleDeposit);
route.get("/all", getDeposits);

module.exports = route;
