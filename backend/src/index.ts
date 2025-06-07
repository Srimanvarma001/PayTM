import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mainRouter from "./routes/index";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", mainRouter);

const PORT = 3000;
app.listen(PORT, () => { });

