import express from "express";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import errorHandler from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors"

const app = express();

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());


// Routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

app.use(errorHandler);

export { app };
