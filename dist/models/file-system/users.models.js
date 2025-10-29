"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModelFileSystem = void 0;
const users_json_1 = __importDefault(require("../../data/users.json"));
const users = users_json_1.default;
class UserModelFileSystem {
    constructor() {
        this.getAll = async () => users.map(x => {
            const { password, ...restOfUser } = x;
            return restOfUser;
        });
        this.getById = async (id) => {
            const user = users.find(x => x.id === id);
            if (user == null)
                return undefined;
            const { password, ...restOfUser } = user;
            return restOfUser;
        };
        this.getByUsername = async (username) => {
            const user = users.find(x => x.username === username);
            if (user == null)
                return undefined;
            const { password, ...restOfUser } = user;
            return restOfUser;
        };
        this.getByUsernameForLogin = async (username) => users.find(x => x.username === username);
        this.create = async (user) => {
            const newUser = {
                id: 'asdasd',
                ...user
            };
            users.push(newUser);
            return newUser;
        };
    }
}
exports.UserModelFileSystem = UserModelFileSystem;
