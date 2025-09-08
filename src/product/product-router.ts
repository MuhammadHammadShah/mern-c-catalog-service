/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";

import { asyncWrapper } from "../common/utils/wrapper";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { Roles } from "../common/constants";
import { ProductController } from "./product-controller";
import createProductValidator from "./create-product-validator";
import { ProductService } from "./product-service";
import fileUpload from "express-fileupload";
import { S3Storage } from "../common/services/S3Storage";
import createHttpError from "http-errors";
import updateProductValidator from "./update-product-validator";

const router = express.Router();

const productService = new ProductService();
const s3Storage = new S3Storage();
const productController = new ProductController(productService, s3Storage);

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    fileUpload({
        limits: { fileSize: 500 * 1024 }, // 500kb
        abortOnLimit: true,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        limitHandler: (req, res, next) => {
            const error = createHttpError(400, "File size exceeds the Limit");
            next(error);
        },
    }),
    createProductValidator,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/unbound-method
    asyncWrapper(productController.create),
);
router.put(
    "/:productId",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    fileUpload({
        limits: { fileSize: 500 * 1024 }, // 500kb
        abortOnLimit: true,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        limitHandler: (req, res, next) => {
            const error = createHttpError(400, "File size exceeds the Limit");
            next(error);
        },
    }),
    updateProductValidator,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/unbound-method
    asyncWrapper(productController.update),
);

export default router;
