const route = require("express").Router();
const auth = require('../middleware/authentication')
route.use(auth)
const {
    addCard, getCards, getSingleCard
} = require("../controllers/cardsController");
route.post("/add", addCard);
route.get("/single/:id", getSingleCard);
route.get("/all", getCards);

module.exports = route;
