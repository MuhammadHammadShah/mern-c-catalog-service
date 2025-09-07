/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { validationResult } from "express-validator";
import { ProductService } from "./product-service";
import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { Product } from "./product-types";

export class ProductController {
    constructor(private productService: ProductService) {}
    create = async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        // Create Product

        // todo : image upload

        // todo : save product to database
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
            image: "image.jpg",
        };
        // add proper request body types
        const newProduct = await this.productService.createProduct(
            product as unknown as Product,
        );

        // send response
        res.json({ id: newProduct._id });
    };
}
