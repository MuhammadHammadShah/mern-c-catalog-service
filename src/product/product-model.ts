import mongoose from "mongoose";

// Schema

const attributeValueSchema = {
    name: {
        type: String,
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
    },
};

const priceConfigurationSchema = new mongoose.Schema({
    priceType: {
        type: String,
        enum: ["base", "additional"],
    },

    availableOptions: {
        type: Map,
        of: Number,
    },
});

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        priceConfiguration: {
            type: Map,
            of: priceConfigurationSchema,
        },
        attributes: [attributeValueSchema],
        tenatId: {
            type: String,
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        isPublish: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

// model

export default mongoose.model("Product", productSchema);
