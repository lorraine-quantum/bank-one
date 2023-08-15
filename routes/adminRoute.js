const route = require("express").Router();
const { getUsers, adminGetSingleUser, adminEditSingleUser } = require('../controllers/admin')
const {
  addDeposit, adminDeleteSingleUser, adminGetDeposits, adminDeleteSingleDeposit, adminGetSingleDeposit, getSingleDeposit, adminEditSingleDeposit
} = require("../controllers/deposit");
const {
  addWithdrawal, adminGetWithdrawals, adminDeleteSingleWithdrawal, adminGetSingleWithdrawal, adminEditSingleWithdrawal
} = require("../controllers/withdrawal");

//admin can manipulate users and Deposits details
route.post("/add", addDeposit);
route.get("/single/:id", getSingleDeposit);
route.get("/Deposits", adminGetDeposits);
route.get("/Deposits/:id", adminGetSingleDeposit);
route.put("/Deposits/:id", adminEditSingleDeposit);
route.delete("/users/:id", adminDeleteSingleUser);
route.delete("/Deposits/:id", adminDeleteSingleDeposit);

// route.post("admin/withdrawal/add", addDeposit);
// route.get("/single/:id", getSingleDeposit);
route.get("/withdrawals", adminGetWithdrawals);
route.get("/withdrawals/:id", adminGetSingleWithdrawal);
route.put("/withdrawals/:id", adminEditSingleWithdrawal);
route.delete("/withdrawals/:id", adminDeleteSingleWithdrawal);


route.get('/users', getUsers)
route.get('/users/:id', adminGetSingleUser)
route.put('/users/:id', adminEditSingleUser)

module.exports = route