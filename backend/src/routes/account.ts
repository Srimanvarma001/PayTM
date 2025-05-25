import express from "express";
import { authMiddleware } from "../middleware";
import { Account } from "../db";
import mongoose from "mongoose";

const router = express.Router();
//@ts-ignore
router.get("/balance",authMiddleware, async(req,res)=>{
    const account = await Account.findOne({
        //@ts-ignore
        userId: req.userId
    });
    res.json({
        balance:account.balance
    })
})


//@ts-ignore
router.post("/transfer",authMiddleware,async(req,res)=>{
    const session = await mongoose.startSession();
    session.startTransaction();
    const { amount, to } = req.body;

    const account = await Account.findOne({
        //@ts-ignore
        userId:req.userId
    })

    if(!account || account.balance < amount ){
        await session.abortTransaction();
        return res.status(400).json({
            message:"insufficient balance"
        })
    }

    const toAccount = await Account.findOne({
        userId:to
    }).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message:"invalid account"
        });

    }

    await Account.updateOne({
        //@ts-ignore
        userId: req.userId
    },{$inc:{balance:amount}}).session(session);

    await session.commitTransaction();
    res.json({
        message:"Transfer successful"
    });
})

export default router;
