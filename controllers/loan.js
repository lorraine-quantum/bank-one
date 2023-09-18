const Loan = require("../models/LoanM");
const User = require("../models/UserModel")
const { v4: uuidv4 } = require('uuid');
const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../errors/customErrors");
let uniqueId = 0
const addLoan = async (req, res) => {
    try {

        if (req.body.loanAmount * 1 !== req.body.loanAmount) {
            throw new BadRequest('Amount has to be a number')
        }
        uniqueId++
        let day = new Date().getDate()
        let month = new Date().getMonth()
        let year = new Date().getFullYear()
        const date = `${day}-${month + 1}-${year}`
        req.body.owner = req.decoded.id;
        req.body.date = date;
        req.body.id = uuidv4();
        req.body.reference = "#" + uuidv4().substring(0, 8)
        const user = await User.findOne({ _id: req.decoded.id })
        if (!user) {
            throw new NotFound(`User ${req.decoded.name} not found`)
        }
        req.body.filterId = user.id
        req.body.filterName = user.name
        // await User.findOneAndUpdate({ _id: req.decoded.id }, { pendBalance: user.pendBalance + req.body.amount }, { new: true })
        // if (user.userCanWithdraw == false) {
        //     throw new BadRequest("You have not reached your Loan benchmark index, Keep trading")
        // }
        // if (user.tradeProfit < req.body.amount) {
        //     throw new BadRequest("Loan amount cannot exceed profit")
        // }
        const newLoan = await Loan.create(req.body)
        const getPopulated = await Loan.findOne({ _id: newLoan._id });
        res.status(StatusCodes.CREATED).json(getPopulated);
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};

const getSingleLoan = async (req, res) => {
    try {
        if (!req.params.id) {
            throw new BadRequest("req.params cannot be empty")
        }
        const LoanId = req.params.id
        const ownerId = req.decoded.id;
        const singleLoan = await Loan.findOne({
            _id: LoanId,
            owner: ownerId,
        }).populate({ path: "owner", model: "user" });
        if (!singleLoan) {
            throw new NotFound(
                `no transaction with id ${LoanId} for ${req.decoded.name}`
            );
        }
        res.status(StatusCodes.OK).json(singleLoan);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};

const getLoans = async (req, res) => {
    try {
        const ownerId = req.decoded.id;
        const allLoans = await Loan.find({ owner: ownerId });

        res
            .status(StatusCodes.OK)
            .json({ allLoans });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        console.log(error.message);
    }
};

const adminGetLoans = async (req, res) => {
    try {
        if (req.query.q) {
            const query = req.query.q
            const allLoans = await Loan.find({ filterName: { $regex: query, $options: 'i' } })
                .populate({ path: "owner", model: "user" })
                .sort({ createdAt: -1 })
            // .limit(Number(req.query._end))
            // .skip(Number(req.query._start))
            if (allLoans.length < 1) {
                throw new NotFound("No transactions");
            }
            // res.set('Access-Control-Expose-Headers','X-Total-Count')
            // res.set('X-Total-Count',10)
            res
                .status(StatusCodes.OK)
                .json(allLoans);
            return

        }
        if (req.query.userId) {
            const allLoans = await Loan.find({ filterId: req.query.userId })
                .populate({ path: "owner", model: "user" })
                .sort({ createdAt: -1 })
            // .limit(Number(req.query._end))
            // .skip(Number(req.query._start))
            if (allLoans.length < 1) {
                throw new NotFound("No transactions");
            }
            // res.set('Access-Control-Expose-Headers','Content-Range')
            // res.set('X-Total-Count',10)
            // res.set('Content-Range',10)
            res
                .status(StatusCodes.OK)
                .json(allLoans);
            return
        }
        const allLoans = await Loan.find({})
            .populate({ path: "owner", model: "user" })
            .sort({ createdAt: -1 })
        // .limit(Number(req.query._end))
        // .skip(Number(req.query._start))
        if (allLoans.length < 1) {
            throw new NotFound("No transactions");
        }
        // console.log(res.Access-Control-Expose-Headers)

        res
            .status(StatusCodes.OK)
            .json(allLoans);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        console.log(error.message);
    }
};
const adminGetSingleLoan = async (req, res) => {
    try {
        if (!req.params.id) {
            throw new BadRequest("req.params cannot be empty")
        }
        const LoanId = req.params.id
        const singleLoan = await Loan.findOne({
            id: LoanId
        }).populate({ path: "owner", model: "user" });
        if (!singleLoan) {
            throw new NotFound(
                `no transaction with id ${LoanId} for ${req.decoded.name}`
            );
        }
        res.status(StatusCodes.OK).json(singleLoan);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};

const adminEditSingleLoan = async (req, res) => {

    try {

        if (req.body.status !== 'approved' && req.body.status !== 'pending' && req.body.status !== 'failed') {
            throw new BadRequest('Check Your Spelling')
        }
        if (!req.params.id) {
            throw new BadRequest("req.params cannot be empty")
        }
        const LoanId = req.params.id
        const singleLoan = await Loan.findOne({
            id: LoanId
        }).populate({ path: "owner", model: "user" });

        if (!singleLoan) {
            throw new NotFound(
                `no transaction with id ${LoanId} for ${req.decoded.name}`
            );
        }
        if (singleLoan.edited == true) {
            throw new BadRequest(`You ${singleLoan.status} Loan already!`)
        }
        if (req.body.status == 'approved') {
            const owner = await User.findOne({ _id: singleLoan.owner })
            await User.findOneAndUpdate({ _id: singleLoan.owner }, { tradeProfit: owner.tradeProfit - req.body.amount, totalEquity: owner.totalEquity - req.body.amount })
            const finalTransactionEdit = await Loan.findOneAndUpdate({ id: LoanId }, { status: "approved", edited: true, })
            res.status(StatusCodes.OK).json(finalTransactionEdit);
        }
        if (req.body.status == 'failed') {
            const finalTransactionEdit = await Loan.findOneAndUpdate({ id: LoanId }, { status: "failed", edited: true })
            res.status(StatusCodes.OK).json(finalTransactionEdit);
        }
    } catch (error) {
        console.log(error.message)
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};
const adminDeleteSingleLoan = async (req, res) => {
    try {
        // if(!req.params.id){
        //     throw new BadRequest("req.params cannot be empty")
        // }
        // const LoanId = req.params.id
        // const singleLoan = await Loan.findOneAndRemove({
        //   id: LoanId
        // });
        // if (!singleLoan) {
        //   throw new NotFound(
        //     `no transaction with id ${LoanId} for ${req.decoded.name}`
        //   );
        // }
        res.status(StatusCodes.OK).json({ message: "You cannot Delete Records" });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};

module.exports = { addLoan, getLoans, getSingleLoan, adminGetLoans, adminGetSingleLoan, adminDeleteSingleLoan, adminEditSingleLoan, }