"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const validateBody_1 = require("../middlewares/validateBody");
const user_schema_1 = require("../schemas/user.schema");
const auth_1 = require("../middlewares/auth");
const createUserRouter = (models) => {
    const userRouter = (0, express_1.Router)();
    const userController = new user_controller_1.UserController(models);
    userRouter.post('/login', (0, validateBody_1.validateBody)(user_schema_1.loginSchema), userController.login);
    userRouter.post('/logout', userController.logout);
    userRouter.post('/', auth_1.authenticateJWT, (0, validateBody_1.validateBody)(user_schema_1.createUserSchema), userController.create);
    userRouter.get('/me', auth_1.authenticateJWT, userController.me);
    return userRouter;
};
exports.createUserRouter = createUserRouter;
