import { paginationLabels } from "../config/pagination";
import productModel from "./product-model";
import { Filter, PaginateQuery, Product } from "./product-types";

export class ProductService {
    /** */
    async createProduct(product: Product) {
        return (await productModel.create(product)) as Product;
    }
    async updateProduct(productId: string, product: Product) {
        return (await productModel.findOneAndUpdate(
            { _id: productId },
            { $set: product },
            {
                new: true,
            },
        )) as Product;
    }
    async getProduct(productId: string): Promise<Product | null> {
        return await productModel.findOne({
            _id: productId,
        });
    }

 
    async getProducts(q: string, filters: Filter, paginateQuery: PaginateQuery) {
        // Build query
        const matchQuery: any = { ...filters };

        if (q && typeof q === "string" && q.trim() !== "") {
            matchQuery.name = { $regex: q, $options: "i" };
        }

        console.log("Final matchQuery:", JSON.stringify(matchQuery, null, 2));

        const aggregate = productModel.aggregate([
            { $match: matchQuery },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                attributes: 1,
                                priceConfiguration: 1,
                            },
                        },
                    ],
                },
            },
            { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
        ]);

        return productModel.aggregatePaginate(aggregate, {
            ...paginateQuery,
            customLabels: paginationLabels,
        });
    }

}
