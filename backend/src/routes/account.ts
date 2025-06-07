import express, { Request, Response } from "express";
import { authMiddleware } from "../middleware";
import { Account, Transaction } from "../db";
import mongoose from "mongoose";

// Add interface for populated User
interface PopulatedUser {
    _id: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
}

// Add interface for Transaction with populated fields
interface TransactionWithUser extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    with: PopulatedUser;
    amount: number;
    type: 'credit' | 'debit';
    timestamp: Date;
}

const router = express.Router();

// Get balance endpoint
//@ts-ignore
router.get("/balance", authMiddleware, async (req: Request, res: Response) => {
    try {
        const account = await Account.findOne({
            userId: req.userId
        });

        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        res.json({
            balance: account.balance
        });
    } catch (error) {
        console.error("Error fetching balance:", error);
        res.status(500).json({
            message: "Error fetching balance"
        });
    }
});

// Get transactions endpoint
//@ts-ignore
router.get("/transactions", authMiddleware, async (req: Request, res: Response) => {
    try {
        const transactions = await Transaction.find({
            userId: req.userId
        })
            .populate<{ with: PopulatedUser }>('with', 'firstName lastName')
            .sort({ timestamp: -1 })
            .limit(10);

        const formattedTransactions = transactions.map(t => ({
            _id: t._id,
            type: t.type,
            amount: t.amount,
            with: `${(t.with as PopulatedUser).firstName} ${(t.with as PopulatedUser).lastName}`,
            timestamp: t.timestamp
        }));

        res.json({
            transactions: formattedTransactions
        });
    } catch (error) {
        console.error("Error in /transactions endpoint:", error);
        res.status(500).json({
            message: "Error fetching transactions",
            transactions: []
        });
    }
});

// Transfer money endpoint
//@ts-ignore
router.post("/transfer", authMiddleware, async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to } = req.body;

        // Input validation
        if (!amount || amount <= 0) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid amount"
            });
        }

        // Find sender's account
        const account = await Account.findOne({
            userId: req.userId
        }).session(session);

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        // Find receiver's account
        const toAccount = await Account.findOne({
            userId: to
        }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Recipient account not found"
            });
        }

        // Perform transfer
        await Account.updateOne(
            { userId: req.userId },
            { $inc: { balance: -amount } }
        ).session(session);

        await Account.updateOne(
            { userId: to },
            { $inc: { balance: amount } }
        ).session(session);

        // Record transactions for both parties
        await Transaction.create(
            [
                {
                    userId: req.userId,
                    with: to,
                    amount: amount,
                    type: 'debit'
                },
                {
                    userId: to,
                    with: req.userId,
                    amount: amount,
                    type: 'credit'
                }
            ],
            {
                session,
                ordered: true // Add this line to fix the error
            }
        );

        await session.commitTransaction();

        res.json({
            message: "Transfer successful",
            success: true
        });

    } catch (error) {
        await session.abortTransaction();
        console.error("Transfer error:", error);
        res.status(500).json({
            message: "Transfer failed",
            success: false
        });
    } finally {
        session.endSession();
    }
});

export default router;
