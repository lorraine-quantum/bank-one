const Investment = require("../models/InvestmentM");
const Withdrawal = require("../models/WithdrawalM");
const Deposit = require("../models/DepositM");
const User = require("../models/UserModel")
const { v4: uuidv4 } = require('uuid');
const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../errors/customErrors");
let uniqueId = 0
const addInvestment = async (req, res) => {
    try {
        if (req.body.amount * 1 !== req.body.amount) {
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
        //add the amount deposited to the total deposits field in the user schema
        req.body.reference = "#" + uuidv4().substring(0, 8)
        const user = await User.findOne({ _id: req.decoded.id })
        if (!user) {
            return res.status(StatusCodes.CREATED).json({ message: "user not found" })
        }
        req.body.filterId = user.id
        req.body.filterName = user.name
        const newInvestment = await Investment.create(req.body)
        res.status(StatusCodes.CREATED).json({ message: `${newInvestment.amount} Invested` });
    } catch (error) {
        console.log(error.message);
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};
const getUser = async (req, res) => {
    try {
        const ownerId = req.decoded.id;
        const user = await User.findOne(
            {
                _id: ownerId,
            }
        );
        if (!user) {
            throw new NotFound(
                `user not found`
            );
        }
        return res.status(StatusCodes.OK).json(user);
    }
    catch (error) {
        console.log(error)
        return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
    }
};
const getSingleInvestment = async (req, res) => {
    try {
        if (!req.params.id) {
            throw new BadRequest("req.params cannot be empty")
        }
        const InvestmentId = req.params.id
        const ownerId = req.decoded.id;
        const singleInvestment = await Investment.findOne({
            _id: InvestmentId,
            owner: ownerId,
        }).populate({ path: "owner", model: "user" });
        if (!singleInvestment) {
            throw new NotFound(
                `no Investment with id ${InvestmentId} for ${req.decoded.name}`
            );
        }
        res.status(StatusCodes.OK).json(singleInvestment);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};
const getInvestments = async (req, res) => {
    try {
        const ownerId = req.decoded.id;
        const allInvestments = await Investment.find({ owner: ownerId });
        
        res
            .status(StatusCodes.OK)
            .json({ allInvestments });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        console.log(error.message);
    }
};
const adminGetInvestments = async (req, res) => {
    try {
        // res.set('Access-Control-Expose-Headers','Content-Range')
        // res.set('X-Total-Count',10)
        // res.set('Content-Range',10)
        if (req.query.q) {
            // const user = await User.findOne({})  
            const query = req.query.q
            const allInvestments = await Investment.find({ filterName: { $regex: query, $options: 'i' } })
                .populate({ path: "owner", model: "user" })
                .sort({ createdAt: -1 })
            // .limit(Number(req.query._end))
            // .skip(Number(req.query._start))
            if (allInvestments.length < 1) {
                throw new NotFound("No Investments");
            }
            // res.set('Access-Control-Expose-Headers','X-Total-Count')
            // res.set('X-Total-Count',10)
            res
                .status(StatusCodes.OK)
                .json(allInvestments);
            return

        }
        if (req.query.userId) {
            const allInvestments = await Investment.find({ filterId: req.query.userId })
                .populate({ path: "owner", model: "user" })
                .sort({ createdAt: -1 })
            // .limit(Number(req.query._end))
            // .skip(Number(req.query._start))
            if (allInvestments.length < 1) {
                throw new NotFound("No Investments");
            }
            // res.set('Access-Control-Expose-Headers','Content-Range')
            // res.set('X-Total-Count',10)
            // res.set('Content-Range',10)
            res
                .status(StatusCodes.OK)
                .json(allInvestments);
            return
        }
        const allInvestments = await Investment.find({})
            .populate({ path: "owner", model: "user" })
            .sort({ createdAt: -1 })
        // .limit(Number(req.query._end))
        // .skip(Number(req.query._start))
        if (allInvestments.length < 1) {
            throw new NotFound("No Investments");
        }
        // console.log(res.Access-Control-Expose-Headers)

        res
            .status(StatusCodes.OK)
            .json(allInvestments);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        console.log(error.message);
    }
};

const getAllSortedTransactions = async (req, res) => {
    try {

        const getInvestmentsAndWithdrawals = async () => {
            const filter = { owner: req.decoded.id }
            const investments = Investment.find(filter).sort('-createdAt').exec()
            const withdrawals = Withdrawal.find(filter).sort('-createdAt').exec()
            const deposits = Deposit.find(filter).sort('-createdAt').exec()
            const [results1, results2, results3] = await Promise.all([investments, withdrawals, deposits])
            const merged = [...results1, ...results2, ...results3].sort((a, b) =>
                b.createdAt - a.createdAt
            )
            return merged

        }

        getInvestmentsAndWithdrawals()
            .then(merged => {
                if (merged.length == 0) {
                    return res.status(404).json({
                        message: `${req.decoded.name} has no transactions`
                    })
                }
                res.status(200).json({ allTransactions: merged })
            })
            .catch(error => {
                res.json({ message: error })
                console.error(error)
            })

    } catch (error) {
        console.error(error)
    }
}
const adminGetSingleInvestment = async (req, res) => {
    try {
        if (!req.params.id) {
            throw new BadRequest("req.params cannot be empty")
        }
        const InvestmentId = req.params.id
        const singleInvestment = await Investment.findOne({
            id: InvestmentId
        }).populate({ path: "owner", model: "user" });
        if (!singleInvestment) {
            throw new NotFound(
                `no Investment with id ${InvestmentId} for ${req.decoded.name}`
            );
        }
        res.status(StatusCodes.OK).json(singleInvestment);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};

const adminEditSingleInvestment = async (req, res) => {
    try {
        if (req.body.status !== 'approved' && req.body.status !== 'pending' && req.body.status !== 'failed') {
            throw new BadRequest('Check Your Spelling')
        }
        if (!req.params.id) {
            throw new BadRequest("req.params cannot be empty")
        }
        const InvestmentId = req.params.id
        const singleInvestment = await Investment.findOne({
            id: InvestmentId
        }).populate({ path: "owner", model: "user" });
        if (!singleInvestment) {
            throw new NotFound(
                `no Investment with id ${InvestmentId} for ${req.decoded.name}`
            );
        }
        if (singleInvestment.edited == true) {
            throw new BadRequest(`You ${singleInvestment.status} Investment already!`)
        }
        // console.log(req.body.status)
        if (req.body.status == 'approved') {
            const owner = await User.findOneAndUpdate(
                { email: singleInvestment.owner.email },
                {
                    totalDeposit: singleInvestment.amount + singleInvestment.owner.totalDeposit,
                    pendBalance: singleInvestment.owner.pendBalance - singleInvestment.amount,


                },
                { new: true })

            await User.findOneAndUpdate({ email: singleInvestment.owner.email }, { totalEquity: owner.totalDeposit + owner.tradeProfit })
            const finalInvestmentEdit = await Investment.findOneAndUpdate({ id: InvestmentId }, { status: "approved", edited: true })
            res.status(StatusCodes.OK).json(finalInvestmentEdit);
        }
        if (req.body.status == 'failed') {
            await User.findOneAndUpdate(
                { email: singleInvestment.owner.email },
                {
                    pendBalance: singleInvestment.owner.pendBalance - singleInvestment.amount
                },
                { new: true })
            const finalInvestmentEdit = await Investment.findOneAndUpdate({ id: InvestmentId }, { status: "failed", edited: true })
            res.status(StatusCodes.OK).json(finalInvestmentEdit);
        }
    } catch (error) {
        console.log(error.message)
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
}
    ;
const adminDeleteSingleInvestment = async (req, res) => {
    try {
        // if(!req.params.id){
        //     throw new BadRequest("req.params cannot be empty")
        // }
        // const InvestmentId = req.params.id
        // const singleInvestment = await Investment.findOneAndRemove({
        //   id: InvestmentId
        // });
        // if (!singleInvestment) {
        //   throw new NotFound(
        //     `no Investment with id ${InvestmentId} for ${req.decoded.name}`
        //   );
        // }
        res.status(StatusCodes.OK).json({ message: "You cannot Delete Records" });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};
const adminDeleteSingleUser = async (req, res) => {
    try {
        if (!req.params.id) {
            throw new BadRequest("req.params cannot be empty")
        }
        const userId = req.params.id
        const singleUser = await User.findOneAndRemove({
            id: userId
        });
        if (singleUser) {
            await Investment.deleteMany({ filterId: userId })
            await Withdrawal.deleteMany({ filterId: userId })
        }
        if (!singleUser) {
            throw new NotFound(
                `no Investment with id ${userId} }`
            );
        }

        res.status(StatusCodes.OK).json({ message: "deleted" });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};


module.exports = { addInvestment, getAllSortedTransactions, getInvestments, getUser, getSingleInvestment, adminGetInvestments, adminGetSingleInvestment, adminDeleteSingleInvestment, adminEditSingleInvestment, adminDeleteSingleUser }