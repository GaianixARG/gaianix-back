"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendData = void 0;
const sendData = (response, status, data) => {
    return response.status(status).send(data);
};
exports.sendData = sendData;
exports.default = exports.sendData;
