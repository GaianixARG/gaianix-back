"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedModelFileSystem = void 0;
const seeds_json_1 = __importDefault(require("../../data/seeds.json"));
const seeds = seeds_json_1.default;
class SeedModelFileSystem {
    constructor() {
        this.getById = async (id) => {
            return seeds.find(x => x.id === id);
        };
        this.update = async (seed) => {
            const idx = seeds.findIndex(x => x.id === seed.id);
            if (idx === -1)
                return;
            seeds[idx] = seed;
        };
        this.remove = async (id) => {
            seeds.filter(x => x.id !== id);
        };
        this.getAll = async () => seeds;
        this.create = async (seed) => {
            const newSeed = {
                id: '55',
                ...seed
            };
            seeds.push(newSeed);
            return newSeed;
        };
    }
}
exports.SeedModelFileSystem = SeedModelFileSystem;
