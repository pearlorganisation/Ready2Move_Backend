import express from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./src/middlewares/errorHandler.js";

const app = express();

app.use(
  cors({
    origin:"http://localhost:3000",
      // process.env.NODE_ENV === "development"
      //   ? ["*"]
      //   : ["*"],
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
import featureRouter from "./src/routes/feature/feature.js";
import bannerRouter from "./src/routes/banner/banner.js";

app.get("/", (req, res) => {
  res.status(200).send("APIs are working...");
});

// Routes Definitions
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/features", featureRouter);
app.use("/api/v1/banners", bannerRouter);

app.use(errorHandler);

export { app };
