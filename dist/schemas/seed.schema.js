"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerSchemasSeed = exports.createSeedSchema = exports.seedSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../types/enums");
// Seed
exports.seedSchema = zod_1.z.object({
    id: zod_1.z.uuid(),
    name: zod_1.z.string(),
    type: zod_1.z.enum(enums_1.ESeed)
});
exports.createSeedSchema = exports.seedSchema.omit({ id: true });
// Swagger
exports.SwaggerSchemasSeed = {
    Seed: zod_1.z.toJSONSchema(exports.seedSchema),
    SeedCreate: zod_1.z.toJSONSchema(exports.createSeedSchema)
};
