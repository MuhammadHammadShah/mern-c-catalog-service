import { body } from "express-validator";

export default [
    body("name")
        .exists()
        .withMessage("Category name is required")
        .isString()
        .withMessage("Category name should be a string"),

    //
    body("priceConfiguration")
        .exists()
        .withMessage("Price configuration is required"),
    body("priceConfiguration.*.priceType")
        .exists()
        .withMessage("Price type is required")
        .custom((values: "base" | "additional") => {
            const validKeys = ["base", "additional"];
            if (!validKeys.includes(values)) {
                throw new Error(
                    ` ${values} is invalid attribute for price type field. Possible values are: [${validKeys.join(
                        ",", // "base" , "additional"
                    )}] `,
                );
            }
        }),
    body("attributes").exists().withMessage("Attribute field is required"),
];
