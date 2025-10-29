"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerSchemasSeed = exports.createFertilizerSchema = exports.fertilizerSchema = void 0;
const zod_1 = require("zod");
// Fertilizante
exports.fertilizerSchema = zod_1.z.object({
    id: zod_1.z.uuid(),
    name: zod_1.z.string()
});
exports.createFertilizerSchema = exports.fertilizerSchema.omit({ id: true });
// Swagger
exports.SwaggerSchemasSeed = {
    Fertilizer: zod_1.z.toJSONSchema(exports.fertilizerSchema),
    FertilizerCreate: zod_1.z.toJSONSchema(exports.createFertilizerSchema)
};
