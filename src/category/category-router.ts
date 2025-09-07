import express from "express";
import { CategoryController } from "./category-controller";
import categoryValidator from "./category-validator";
import { CategoryService } from "./category-service";

import logger from "../config/logger";
import { asyncWrapper } from "../common/utils/wrapper";

const router = express.Router();

const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService, logger);

router.post(
    "/",
    categoryValidator,

    // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/unbound-method
    asyncWrapper(categoryController.create),
);

export default router;
