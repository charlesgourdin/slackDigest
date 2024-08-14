import express, { Request, Response } from "express";
import dotenv from "dotenv";
import router from "./routes";

const app = express();
app.use(express.urlencoded({ extended: true }));
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
    res.send("App is running");
});

app.listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
    throw new Error(error.message);
});


