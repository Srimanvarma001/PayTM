import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mainRouter from "./routes/index";
import cors from "cors";



const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", mainRouter);

app.listen(3000);

