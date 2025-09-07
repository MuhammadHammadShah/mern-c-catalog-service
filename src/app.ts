import express, { Request, Response } from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import categoryRouter from "./category/category-router";

const app = express();

/** middlewares */

app.use(express.json());

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
