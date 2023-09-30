const route = require("express").Router();
const { getUsers, adminGetSingleUser, adminEditSingleUser } = require('../controllers/admin')
const {
  addDeposit, adminAddDeposit, adminDeleteSingleUser, adminGetDeposits, adminDeleteSingleDeposit, adminGetSingleDeposit, getSingleDeposit, adminEditSingleDeposit
} = require("../controllers/deposit");
const {
  adminAddNotification, adminGetNotifications, adminDeleteSingleNotification, adminGetSingleNotification, adminEditSingleNotification
} = require("../controllers/notification");
const {
  addWithdrawal, adminGetWithdrawals, adminDeleteSingleWithdrawal, adminGetSingleWithdrawal, adminEditSingleWithdrawal
} = require("../controllers/withdrawal");
const { adminGetLoans, adminGetSingleLoan, adminEditSingleLoan } = require('../controllers/loan')
const { adminGetCards, adminGetSingleCard, adminEditSingleCard } = require('../controllers/cardsController')
const { adminGetInvestments, adminGetSingleInvestment, adminEditSingleInvestment } = require('../controllers/investmentController')


//admin can manipulate users and Deposits details
route.post("/add", addDeposit);
route.post("/deposits", adminAddDeposit);
route.post("/notifications", adminAddNotification);
route.get("/cards", adminGetCards);
route.put("/cards/:id", adminEditSingleCard);
route.get("/cards/:id", adminGetSingleCard);
route.get("/Deposits", adminGetDeposits);
route.get("/Deposits/:id", adminGetSingleDeposit);
route.put("/Deposits/:id", adminEditSingleDeposit);
route.get("/notifications", adminGetNotifications);
route.get("/notifications/:id", adminGetSingleNotification);
route.put("/notifications/:id", adminEditSingleNotification);
route.delete("/users/:id", adminDeleteSingleUser);
route.delete("/Deposits/:id", adminDeleteSingleDeposit);
route.delete("/notifications/:id", adminDeleteSingleNotification);

// route.post("admin/withdrawal/add", addDeposit);
// route.get("/single/:id", getSingleDeposit);
route.get("/withdrawals", adminGetWithdrawals);
route.get("/withdrawals/:id", adminGetSingleWithdrawal);
route.put("/withdrawals/:id", adminEditSingleWithdrawal);
// route.delete("/withdrawals/:id", adminDeleteSingleWithdrawal);

route.get("/loans", adminGetLoans);
route.get("/loans/:id", adminGetSingleLoan);
route.put("/loans/:id", adminEditSingleLoan);
// route.delete("/loans/:id", adminDeleteSingleWithdrawal);

route.get("/investments", adminGetInvestments);
route.get("/investments/:id", adminGetSingleInvestment);
route.put("/investments/:id", adminEditSingleInvestment);
// route.delete("/investments/:id", adminDeleteSingleWithdrawal);


route.get('/users', getUsers)
route.get('/users/:id', adminGetSingleUser)
route.put('/users/:id', adminEditSingleUser)

module.exports = route