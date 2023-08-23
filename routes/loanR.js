const route = require("express").Router();
const auth = require('../middleware/authentication')
route.use(auth)
const {
    addLoan, getLoans, getSingleLoan
} = require("../controllers/loan");

route.post("/add", addLoan);
route.get("/single/:id", getSingleLoan);
route.get("/all", getLoans);

module.exports = route;
