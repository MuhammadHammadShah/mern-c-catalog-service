import { body } from "express-validator";

export default [
    body("name")
        .exists()
        .withMessage("Product name is required")
        .isString()
        .withMessage("Product name should be a string"),
    body("description").exists().withMessage("Product description is required"),
    body("attributes").exists().withMessage("Attribute field is required"),
    body("tenantId").exists().withMessage("Tenant id is required"),
    body("categoryId").exists().withMessage("category id is required"),
    body("priceConfiguration")
        .exists()
        .withMessage("Product priceConfiguration is required"),
    body("image").custom((value, { req }) => {
        if (!req.files) throw new Error("Product image is required");

        return true;
    }),
];
