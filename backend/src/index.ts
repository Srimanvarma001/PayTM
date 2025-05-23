import express from "express";
import { Request, Response } from "express";
const { User } = require("./db"); 
const mainRouter = require("./routes/index");

const app = express();
app.use(express.json());
app.use("api/v1",mainRouter);

app.post("/signup", async (req : Request,res: Response )=>{
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const password = req.body.password;
    const username = req.body.name;

    await User.create({
        firstname: firstname,
        lastname: lastname,
        password: password,
        username: username
    })

    res.json({
        message: " You are signed Up"
    })


})

app.post("/signin",(req : Request,res: Response )=>{
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const password = req.body.password;
    const username = req.body.name;

})

app.post("/update",(req:Request,res:Response)=>{

})

