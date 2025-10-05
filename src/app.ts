import express, { Request, Response } from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import categoryRouter from "./category/category-router";
import productRouter from "./product/product-router";
import cookieParser from "cookie-parser";
import ToppingRouter from "./topping/topping-router"

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
app.use("/products", productRouter);
app.use("/toppings", ToppingRouter);

/** */
app.use(globalErrorHandler);

export default app;
