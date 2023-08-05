const route = require("express").Router();
const {
    addInvestment, getInvestments, getUser, getSingleInvestment
} = require("../controllers/investmentController");

route.post("/add", addInvestment);
route.get("/token-user", getUser);
route.get("/single/:id", getSingleInvestment);
route.get("/all", getInvestments);

module.exports = route;
