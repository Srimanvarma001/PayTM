import express from "express";
import type { Request, Response } from "express";
import { Account, User } from "../db"
import { z } from "zod";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { authMiddleware } from "../middleware";


const userRouter = express.Router();

const signupBody = z.object({
    username: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string(),
});

//@ts-ignore
userRouter.post("/signup", async (req: Request, res: Response) => {
    const result = signupBody.safeParse(req.body);
    if (!result.success) {
        return res.status(411).json({
            message: "Invalid input",
            errors: result.error.format(),
        });
    }


    const existingUser = await User.findOne({ 
        username:req.body.username
     });

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken",
        });
    }

    const user = await User.create({
        username:req.body.username,
        password:req.body.password,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
    });

    const userId= user._id;

    await Account.create({
        userId,
        balance: 1+Math.random()*10000
    })

    const token = jwt.sign({ 
        userId: user._id 
    }, JWT_SECRET);
    user.token = token;


    res.json({
        message: "User created successfully",
        token,
    });
});

const signinBody = z.object({
    username: z.string().email(),
    password: z.string()

})

//@ts-ignore
userRouter.post("/signin", async (req: Request, res: Response) => {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    })

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
        res.json({
            token: token
        })
        return;
    }

    res.status(411).json({
        message: "Error while logging in"
    })
})

const updateBody = z.object({
    firstName: z.string(),
    lastName: z.string(),
    password: z.string()
})

//@ts-ignore
userRouter.put("/",authMiddleware,async(req,res)=>{
    const { success}= updateBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message: "Error while updating the information"
        })
    }

    //@ts-ignore
    await User.updateOne({_id: req.userId},req.body);

    res.json({
        message: "Updated succefully"
    })
    


});

userRouter.get("/bulk",async(req,res)=>{
    const filter = req.query.filter || "";

    const users = await User.find({
        $or:[{
            fistName:{
                "$regex":filter
            }
        },{
            lastName:{
                "$regex":filter
            }
        }]
    })

   res.json({
    //@ts-ignore
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

export default userRouter;
