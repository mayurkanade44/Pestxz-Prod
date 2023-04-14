import express, { json } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

import userRouter from "./routes/userRoute.js";
import companyRouter from "./routes/companyRoute.js";
import shipToRouter from "./routes/shipToRoute.js";
import adminRouter from "./routes/adminRoute.js";
import locationRouter from "./routes/locationRoute.js";
import reportRouter from "./routes/reportRoute.js";
import { authenticateUser, authorizeUser } from "./middleware/auth.js";

const app = express();
dotenv.config();
mongoose.set("strictQuery", false);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

const __dirname = dirname(fileURLToPath(import.meta.url));

// only when ready to deploy
app.use(express.static(path.resolve(__dirname, "./client/build")));

app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

app.use("/api/user", userRouter);
app.use(
  "/api/company",
  authenticateUser,
  authorizeUser("Super Admin"),
  companyRouter
);
app.use("/api/shipTo", authenticateUser, authorizeUser("Admin"), shipToRouter);
app.use("/api/admin", authenticateUser, authorizeUser("Admin"), adminRouter);
app.use(
  "/api/location",
  authenticateUser,
  authorizeUser("Admin"),
  locationRouter
);
app.use("/api/report", authenticateUser, reportRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(port, console.log("server is listing"));
  } catch (error) {
    console.log(error);
  }
};

start();
