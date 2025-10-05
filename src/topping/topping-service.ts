import toppingModel from "./topping-model";
import { Topping } from "./topping-types";

export class ToppingService {
    async create(topping: Topping) {
        return await toppingModel.create(topping);
    }

    async getAll(tenantId?: string) {
        const filter = tenantId ? { tenantId } : {}; // ✅ if no tenantId, fetch all
        return toppingModel.find(filter);
    }
}
