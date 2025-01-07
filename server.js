import express from "express";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import { ConnectDB } from "./config/db.js";
import "dotenv/config.js";

const app = express();
app.use(express.json());

ConnectDB();

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
