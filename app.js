import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import axios from "axios";
import sharp from "sharp"; // ✅ Convert images

const app = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? [
            "http://localhost:3000",
            "http://localhost:3002",
            "http://localhost:3001",
          ]
        : ["*"],
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
// import { userRouter } from "./src/routes/user/user.js";
import featureRouter from "./src/routes/feature/feature.js";
import bannerRouter from "./src/routes/banner/banner.js";
import projectRouter from "./src/routes/project/project.js";
import propertyRouter from "./src/routes/property/property.js";
import Project from "./src/models/project/project.js";

app.get("/", (req, res) => {
  res.status(200).send("APIs are working...");
});

// Routes Definitions
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/features", featureRouter);
app.use("/api/v1/banners", bannerRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/properties", propertyRouter);

// PDF Generation Route
app.get("/pdf/:id", async (req, res) => {
  try {
    console.log("Fetching project data...");
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const doc = new PDFDocument({ margin: 50 });

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${project.title.replace(/ /g, "_")}.pdf"`
    );

    doc.pipe(res); // Stream PDF to response
    doc.font("fonts/DejaVuSans.ttf"); // Load Custom Font
    doc.registerFont("fonts/DejaVuSans-Bold.ttf");
    // ✅ Title & Description
    doc.fontSize(25).text(project.title, { align: "center" });
    doc
      .fontSize(14)
      .text(project.subTitle || "", { align: "center", underline: true });
    doc
      .moveDown()
      .fontSize(12)
      .text(project.description || "No description available.");
    doc.moveDown();

    // ✅ Location
    doc.fontSize(15).text("Location:");
    // doc.font("fonts/DejaVuSans-Bold.ttf").text("Location:");
    doc
      .fontSize(12)
      .text(
        `${project.locality || "N/A"}, ${project.city || "N/A"}, ${
          project.state || "N/A"
        }`
      );
    doc.moveDown();

    // ✅ Price & Area Details
    doc.fontSize(14).text("Price Details:");
    doc
      .fontSize(12)
      .text(
        `Price Range: Rs${project.priceRange?.min || 0} - Rs${
          project.priceRange?.max || 0
        }`
      );
    doc.fontSize(12).text(`Price Per SqFt: ₹${project.pricePerSqFt || "N/A"}`);
    doc.moveDown();

    doc.fontSize(14).text("Area:");
    doc
      .fontSize(12)
      .text(
        `Area Range: ${project.areaRange?.min || 0} - ${
          project.areaRange?.max || 0
        } SqFt`
      );
    doc.moveDown();

    // ✅ RERA Information
    doc.fontSize(14).text("RERA Details:");
    doc.fontSize(12).text(`RERA Number: ${project.reraNumber || "N/A"}`);
    doc
      .fontSize(12)
      .text(
        `Possession Date: ${
          new Date(project.reraPossessionDate).toDateString() || "N/A"
        }`
      );
    doc.moveDown();

    // ✅ YouTube Link
    if (project.youtubeLink) {
      doc.fontSize(14).text("Video Tour:");
      doc.fontSize(12).text(project.youtubeLink, {
        link: project.youtubeLink,
        underline: true,
      });
      doc.moveDown();
    }

    // ✅ Load & Convert Images
    if (project.imageGallery && project.imageGallery.length > 0) {
      doc.fontSize(14).text("Property Images:");
      for (const image of project.imageGallery) {
        try {
          const response = await axios.get(image.secure_url, {
            responseType: "arraybuffer",
          });
          const pngBuffer = await sharp(response.data)
            .toFormat("png")
            .toBuffer();

          doc.image(pngBuffer, { width: 250, height: 150, align: "center" });
          doc.moveDown();
        } catch (err) {
          console.error("Error loading image:", err);
        }
      }
    } else {
      doc.text("No images available.");
    }

    doc.end(); // ✅ Finalize PDF
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Error generating PDF" });
  }
});

app.use(errorHandler);

export { app };
