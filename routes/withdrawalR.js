const route = require("express").Router();
const auth = require('../middleware/authentication')
route.use(auth)
const {
    addWithdrawal, addWithdrawalPaypal, addWithdrawalSkrill, getWithdrawals, getSingleWithdrawal
} = require("../controllers/withdrawal");

route.post("/add-bank", addWithdrawal);
route.post("/add-paypal", addWithdrawalPaypal);
route.post("/add-skrill", addWithdrawalSkrill);
route.get("/single/:id", getSingleWithdrawal);
route.get("/all", getWithdrawals);

module.exports = route;
