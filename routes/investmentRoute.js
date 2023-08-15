const route = require("express").Router();
const auth = require('../middleware/authentication')
route.use(auth)
const {
    addInvestment, getAllSortedTransactions, getInvestments, getUser, getSingleInvestment
} = require("../controllers/investmentController");

route.post("/add", addInvestment);
route.get("/token-user", getUser);
route.get("/single/:id", getSingleInvestment);
route.get("/all", getInvestments);
route.get("/withdrawal/sorted", getAllSortedTransactions);

module.exports = route;
