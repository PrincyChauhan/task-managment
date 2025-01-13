import express from "express";
import {
  signup,
  signin,
  inviteUser,
  acceptInvitation,
  forgotPassword,
  resetPassword,
  createUser,
  getUsers,
} from "../controllers/adminController.js";
import { isAdmin } from "../middlewares/auth.js";

const adminRouter = express.Router();

adminRouter.post("/signup", signup);
adminRouter.post("/signin", signin);
adminRouter.post("/create-user", isAdmin, createUser);
adminRouter.post("/invite", inviteUser);
adminRouter.post("/accept-invitation", acceptInvitation);
adminRouter.get("/users", isAdmin, getUsers);
//forgot password

adminRouter.post("/forgot-password", forgotPassword);
adminRouter.post("/rest-password", resetPassword);

export default adminRouter;
