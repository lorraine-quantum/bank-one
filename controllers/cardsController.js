const Card = require("../models/Cards");
const User = require("../models/UserModel")
const { v4: uuidv4 } = require('uuid');
const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../errors/customErrors");
const { getRandom16DigitNumber, formatAsCreditCard } = require('../utils/card-number')

let uniqueId = 0
const addCard = async (req, res) => {
    try {
        uniqueId++
        //add the amount deposited to the total deposits field in the user schema
        const user = await User.findOne({ _id: req.decoded.id })
        const existingCard = await Card.findOne({ owner: req.decoded.id, cardType: req.body.cardType })
        if (existingCard) {
            return res.status(StatusCodes.CONFLICT).json({ message: `You already have a ${req.body.cardType} card` })
        }
        let cardAmount = 25
        if (!user) {
            throw new NotFound(`User ${req.decoded.name} not found`)
        }
        if (user.totalBalance < cardAmount) {
            throw new BadRequest(`Insufficient balance, this card costs $${cardAmount}`)
        }


        await User.findOneAndUpdate({ _id: req.decoded.id }, { totalBalance: user.totalBalance - cardAmount })

        req.body.owner = req.decoded.id;
        req.body.id = uuidv4();

        req.body.filterId = user.id
        req.body.filterName = user.name


        const random16DigitNumber = getRandom16DigitNumber();
        const creditCardNumber = formatAsCreditCard(random16DigitNumber);
        const cvc = getRandom16DigitNumber().substring(0, 3)
        const signature = getRandom16DigitNumber().substring(3, 8)
        req.body.cardNumber = creditCardNumber
        req.body.cardHolderName = req.decoded.name
        req.body.cvcCode = cvc
        req.body.signature = signature




        const newCard = await Card.create(req.body)

        const getPopulated = await Card.findOne({ _id: newCard._id }).populate({ path: "owner", model: "user" });
        res.status(StatusCodes.CREATED).json({
            expiryDate: newCard.expiryDate,
            cardType: newCard.cardType,
            cardNumber: newCard.cardNumber,
            cardHolderName: newCard.cardHolderName,
            cvcCode: newCard.cvcCode,
            signature: newCard.signature,
            _id: newCard._id,
        });
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};

const getSingleCard = async (req, res) => {
    try {
        if (!req.params.id) {
            throw new BadRequest("req.params cannot be empty")
        }
        const CardId = req.params.id
        const ownerId = req.decoded.id;
        const singleCard = await Card.findOne({
            _id: CardId,
            owner: ownerId,
        }).populate({ path: "owner", model: "user" });
        if (!singleCard) {
            throw new NotFound(
                `no card with id ${CardId} for ${req.decoded.name}`
            );
        }
        res.status(StatusCodes.OK).json(singleCard);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};

const getCards = async (req, res) => {
    try {
        const ownerId = req.decoded.id;
        const allCards = await Card.find({ owner: ownerId });
        const extractedData = allCards.map((newCard) => {
            return {
                expiryDate: newCard.expiryDate,
                cardType: newCard.cardType,
                status: newCard.status,
                cardNumber: newCard.cardNumber,
                cardHolderName: newCard.cardHolderName,
                cvcCode: newCard.cvcCode,
                signature: newCard.signature,
                _id: newCard._id,
            }
        })
        res
            .status(StatusCodes.OK)
            .json({ allCards: extractedData });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        console.log(error.message);
    }
};

const adminGetCards = async (req, res) => {
    try {
        if (req.query.q) {
            const query = req.query.q
            const allCards = await Card.find({ filterName: { $regex: query, $options: 'i' } })
                .populate({ path: "owner", model: "user" })
                .sort({ createdAt: -1 })
            // .limit(Number(req.query._end))
            // .skip(Number(req.query._start))
            if (allCards.length < 1) {
                throw new NotFound("No transactions");
            }
            // res.set('Access-Control-Expose-Headers','X-Total-Count')
            // res.set('X-Total-Count',10)
            res
                .status(StatusCodes.OK)
                .json(allCards);
            return

        }
        if (req.query.userId) {
            const allCards = await Card.find({ filterId: req.query.userId })
                .populate({ path: "owner", model: "user" })
                .sort({ createdAt: -1 })
            // .limit(Number(req.query._end))
            // .skip(Number(req.query._start))
            if (allCards.length < 1) {
                throw new NotFound("No transactions");
            }
            // res.set('Access-Control-Expose-Headers','Content-Range')
            // res.set('X-Total-Count',10)
            // res.set('Content-Range',10)
            res
                .status(StatusCodes.OK)
                .json(allCards);
            return
        }
        const allCards = await Card.find({})
            .populate({ path: "owner", model: "user" })
            .sort({ createdAt: -1 })
        // .limit(Number(req.query._end))
        // .skip(Number(req.query._start))

        // console.log(res.Access-Control-Expose-Headers)

        res
            .status(StatusCodes.OK)
            .json(allCards);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        console.log(error.message);
    }
};
const adminGetSingleCard = async (req, res) => {
    try {
        if (!req.params.id) {
            throw new BadRequest("req.params cannot be empty")
        }
        const CardId = req.params.id
        const singleCard = await Card.findOne({
            id: CardId
        }).populate({ path: "owner", model: "user" });
        if (!singleCard) {
            throw new NotFound(
                `no transaction with id ${CardId} for ${req.decoded.name}`
            );
        }
        res.status(StatusCodes.OK).json(singleCard);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};

const adminEditSingleCard = async (req, res) => {

    try {

        if (req.body.status !== 'approved' && req.body.status !== 'pending' && req.body.status !== 'failed') {
            throw new BadRequest('Check Your Spelling')
        }
        if (!req.params.id) {
            throw new BadRequest("req.params cannot be empty")
        }
        const CardId = req.params.id
        const singleCard = await Card.findOne({
            id: CardId
        }).populate({ path: "owner", model: "user" });

        if (!singleCard) {
            throw new NotFound(
                `no transaction with id ${CardId} for ${req.decoded.name}`
            );
        }

        if (req.body.status == 'approved') {
            const owner = await User.findOne({ _id: singleCard.owner })
            const finalTransactionEdit = await Card.findOneAndUpdate({ id: CardId }, { status: "approved", edited: true, })
            res.status(StatusCodes.OK).json(finalTransactionEdit);
        }
        if (req.body.status == 'failed') {
            const finalTransactionEdit = await Card.findOneAndUpdate({ id: CardId }, { status: "failed", edited: true })
            res.status(StatusCodes.OK).json(finalTransactionEdit);
        }
    } catch (error) {
        console.log(error.message)
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};
const adminDeleteSingleCard = async (req, res) => {
    try {
        // if(!req.params.id){
        //     throw new BadRequest("req.params cannot be empty")
        // }
        // const CardId = req.params.id
        // const singleCard = await Card.findOneAndRemove({
        //   id: CardId
        // });
        // if (!singleCard) {
        //   throw new NotFound(
        //     `no transaction with id ${CardId} for ${req.decoded.name}`
        //   );
        // }
        res.status(StatusCodes.OK).json({ message: "You cannot Delete Records" });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};

module.exports = { addCard, getCards, getSingleCard, adminGetCards, adminGetSingleCard, adminDeleteSingleCard, adminEditSingleCard, }