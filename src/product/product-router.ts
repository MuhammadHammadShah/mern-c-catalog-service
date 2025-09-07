/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";

import { asyncWrapper } from "../common/utils/wrapper";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { Roles } from "../common/constants";
import { ProductController } from "./product-controller";
import createProductValidator from "./create-product-validator";

const router = express.Router();

const productController = new ProductController();

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    createProductValidator,

    // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/unbound-method
    asyncWrapper(productController.create),
);

export default router;
