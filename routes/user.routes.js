import express from "express";
import { getUser, login, register } from "../controller/user.controller.js";
import { validate } from "../middleware/validate.js";

const user = express.Router();

user.get("/getUser", getUser);

user.post("/register", validate, register);
user.post("/login", validate, login);

export default user;