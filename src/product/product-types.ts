import mongoose from "mongoose";

export interface Product {
    _id?: mongoose.Types.ObjectId;
    name: string;
    description: string;
    priceConfiguration: Record<string, any>; // object, not string
    attributes: { name: string; value: any }[]; // array, not string
    tenantId: string;
    categoryId: string
    image: string;
    isPublish: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Filter {
    tenantId?: string;
    categoryId?: mongoose.Types.ObjectId;
    isPublish?: boolean;
}

export interface PaginateQuery {
    page: number;
    limit: number;
}
