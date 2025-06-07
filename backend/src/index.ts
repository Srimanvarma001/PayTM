import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mainRouter from "./routes/index";

const app = express();

app.use(cors());
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.use("/api/v1", mainRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

