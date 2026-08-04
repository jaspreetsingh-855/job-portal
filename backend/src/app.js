import express from "express";
import cors from "cors";
import rootRoutes from "./routes/index.js";
import jobRoutes from "./routes/jobRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userJobRoutes from "./routes/userJobRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(rootRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user-jobs", userJobRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
