import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fileupload from "express-fileupload";
import householdRoutes from "./routes/households";
import colors from "colors";
import { errorHandler } from "./middleware/error";

// Load environment variables
dotenv.config({ path: "./src/config/config.env" });

// Create Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL ?? "http://localhost:3000",
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1",
      "localhost:8000",
      "http://localhost:3000",
      "http://client:3000",
      "http://markeybass.net:3000",
      "https://markeybass.net:3000",
      "http://markeybass.net",
      "https://markeybass.net",
      "http://app.markeybass.net:3000",
      "https://app.markeybass.net:3000",
      "http://44.236.228.14:3000",
      "https://44.236.228.14:3000",
      "http://127.0.0.1:3000",
      "https://127.0.0.1:3000",
      "http://35.165.203.90:3000",
      "https://35.165.203.90:3000",
      "*"
    ],
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// File uploading middleware
app.use(
  fileupload({
    limits: {
      fileSize: Number(process.env.MAX_FILE_SIZE_TO_UPLOAD) || 5000000, // 5MB default
    },
  })
);

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/census-surveyor";
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log(colors.inverse.underline("Connected to MongoDB")))
  .catch((error) => console.error(colors.red("MongoDB connection error:"), error));

// Routes
app.use("/api/v1/households", householdRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(colors.inverse.underline(`Server is running on port ${PORT}...`));
});
