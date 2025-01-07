import express from "express";
import {
  signup,
  signin,
  inviteUser,
  acceptInvitation,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/signup", signup);
adminRouter.post("/signin", signin);
adminRouter.post("/invite", inviteUser);
adminRouter.post("/accept-invitation", acceptInvitation);

export default adminRouter;
