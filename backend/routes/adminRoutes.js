import express from "express";
import {
  signup,
  signin,
  acceptInvitation,
  forgotPassword,
  resetPassword,
  getUsers,
  createInviteUser,
  logout,
  deleteUser,
} from "../controllers/adminController.js";
import { isAdmin } from "../middlewares/auth.js";

const adminRouter = express.Router();

adminRouter.post("/signup", signup);
adminRouter.post("/signin", signin);

adminRouter.post("/create-invite", isAdmin, createInviteUser);
adminRouter.post("/accept-invitation", acceptInvitation);
adminRouter.get("/users", getUsers);
adminRouter.post("/forgot-password", forgotPassword);
adminRouter.post("/rest-password", resetPassword);
adminRouter.delete("/delete/:userId", isAdmin, deleteUser);
adminRouter.post("/logout", logout);

export default adminRouter;
