"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var home_route_1 = __importDefault(require("./router/home.route"));
var __dirname = import.meta.dirname;
console.log(__dirname);
var app = (0, express_1.default)();
app.use("/", home_route_1.default);
app.listen(3000, function () {
    console.log("Server is running on http://localhost:3000");
});
