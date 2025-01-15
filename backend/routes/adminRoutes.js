import express from "express";
import {
  signup,
  signin,
  acceptInvitation,
  forgotPassword,
  resetPassword,
  getUsers,
  createInviteUser,
} from "../controllers/adminController.js";
import { isAdmin } from "../middlewares/auth.js";

const adminRouter = express.Router();

adminRouter.post("/signup", signup);
adminRouter.post("/signin", signin);

adminRouter.post("/create-invite", isAdmin, createInviteUser);
adminRouter.post("/accept-invitation", acceptInvitation);
adminRouter.get("/users", isAdmin, getUsers);
//forgot password
adminRouter.post("/forgot-password", forgotPassword);
adminRouter.post("/rest-password", resetPassword);

export default adminRouter;
