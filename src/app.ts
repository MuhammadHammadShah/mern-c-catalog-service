import express, { Request, Response } from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import categoryRouter from "./category/category-router";
import cookieParser from "cookie-parser";

const app = express();

/** middlewares */

app.use(express.json());
app.use(cookieParser());

/** */

app.get("/", (req: Request, res: Response) => {
    res.json({
        message: "Hello from catalog service",
    });
});

/** Routes */

app.use("/categories", categoryRouter);

/** */
app.use(globalErrorHandler);

export default app;
