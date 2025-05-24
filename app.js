import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { errorHandler } from "./src/middlewares/errorHandler.js";

const app = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? [
            "http://localhost:3000",
            "http://localhost:3002",
            "http://localhost:3003",
          ]
        : ["https://ready2-move.vercel.app", "https://ready2move.co.in"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Specify allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.set("view engine", "ejs");

//Routes Imports
import authRouter from "./src/routes/auth/auth.js";
import userRouter from "./src/routes/user/user.js";
import featureRouter from "./src/routes/feature/feature.js";
import bannerRouter from "./src/routes/banner/banner.js";
import projectRouter from "./src/routes/project/project.js";
import propertyRouter from "./src/routes/property/property.js";
import featuredRouter from "./src/routes/featuredProjectAndProperty/featuredProjectAndProperty.js";
import leadRouter from "./src/routes/lead/leads.js";
import dashboardRouter from "./src/routes/dashboard/dashoard.js";
import faqRouter from "./src/routes/faq/faq.js";
import blogRouter from "./src/routes/blog/blog.js";
import footerRouter from "./src/routes/footer/footer.js";

app.get("/", (req, res) => {
  res.status(200).send("APIs are working...");
});

// Routes Definitions
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/features", featureRouter);
app.use("/api/v1/banners", bannerRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/featured", featuredRouter);
app.use("/api/v1/leads", leadRouter);
app.use("/api/v1/faqs", faqRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/footer", footerRouter);

app.use(errorHandler);

export { app };
