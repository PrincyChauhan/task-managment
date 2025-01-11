import express from "express";
import {
  signup,
  signin,
  inviteUser,
  acceptInvitation,
  forgotPassword,
  resetPassword,
  createUser,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/signup", signup);
adminRouter.post("/signin", signin);
adminRouter.post("/create-user", createUser);
adminRouter.post("/invite", inviteUser);
adminRouter.post("/accept-invitation", acceptInvitation);

//forgot password

adminRouter.post("/forgot-password", forgotPassword);
adminRouter.post("/rest-password", resetPassword);

export default adminRouter;
