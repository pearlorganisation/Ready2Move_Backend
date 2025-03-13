import express from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./src/middlewares/errorHandler.js";

const app = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? ["http://localhost:3002", "http://localhost:3001","http://localhost:3000"]
        : ["*"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Specify allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.set("view engine", "ejs");

//Routes Imports
import authRouter from "./src/routes/auth/auth.js";
// import { userRouter } from "./src/routes/user/user.js";

app.get("/", (req, res) => {
  res.status(200).send("APIs are working...");
});

// Routes Definitions
app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/user", userRouter);

app.use(errorHandler);

export { app };
