/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { validationResult } from "express-validator";
import { ProductService } from "./product-service";
import { v4 as uuidv4 } from "uuid";
import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { Product } from "./product-types";
import { FileStorage } from "../common/types/storage";
import { UploadedFile } from "express-fileupload";
import { AuthRequest } from "../common/types";
import { Roles } from "../common/constants";

export class ProductController {
    constructor(
        private productService: ProductService,
        private storage: FileStorage,
    ) {}
    create = async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        // Create Product

        //  image upload

        const image = req.files!.image as UploadedFile;
        const imageName = uuidv4();

        //  save product to database

        await this.storage.upload({
            filename: imageName,
            fileData: image.data,
        });
        const {
            name,
            description,
            priceConfiguration,
            attributes,
            tenantId,
            isPublish,
            categoryId,
        } = req.body;

        const product = {
            name,
            description,
            priceConfiguration: JSON.parse(priceConfiguration as string),
            attributes: JSON.parse(attributes as string),
            tenantId,
            isPublish,
            categoryId,
            image: imageName,
        };
        // add proper request body types
        const newProduct = await this.productService.createProduct(
            product as unknown as Product,
        );

        // send response
        res.json({ id: newProduct._id });
    };

    /** */
    update = async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        //
        const { productId } = req.params;

        /** check if tenant has access to the desired product  */

        const product = await this.productService.getProduct(productId);
        if (!product) {
            return next(createHttpError(404, "Product not found"));
        }

        if ((req as AuthRequest).auth.role !== Roles.ADMIN) {
            const tenant = (req as AuthRequest).auth.tenant;
            if (product.tenantId !== String(tenant)) {
                return next(
                    createHttpError(
                        401,
                        "You are not allowed to access this product",
                    ),
                );
            }
        }

        //
        let imageName: string | undefined;
        let oldImage: string | undefined;
        //
        if (req.files?.image) {
            oldImage = product.image;

            const image = req.files?.image as UploadedFile;
            imageName = uuidv4();

            await this.storage.upload({
                filename: imageName,
                fileData: image.data,
            });

            await this.storage.delete(oldImage);
        }

        const {
            name,
            description,
            priceConfiguration,
            attributes,
            tenantId,
            isPublish,
            categoryId,
        } = req.body;

        const productToUpdate = {
            name,
            description,
            priceConfiguration: JSON.parse(priceConfiguration as string),
            attributes: JSON.parse(attributes as string),
            tenantId,
            isPublish,
            categoryId,
            image: imageName ? imageName : (oldImage as string),
        };

        await this.productService.updateProduct(productId, productToUpdate);

        res.json({
            id: productId,
        });
    };
    /** */
}
