/**
 * Census Surveyor Database Seeder
 * 
 * Commands:
 * - npm run seed:import  - Add sample households to database
 * - npm run seed:delete  - Remove all households from database
 * - npm run seed         - Show available commands
 */

import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { HouseholdModel } from "../models/Household";
import colors from "colors";

// Load environment variables
dotenv.config({ path: "./src/config/config.env" });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/census-surveyor")
  .then(() => console.log("MongoDB Connected...".green))
  .catch((err) => {
    console.error("MongoDB connection error:".red, err);
    process.exit(1);
  });

// Read JSON file
const households = JSON.parse(
  fs.readFileSync(path.join(__dirname, "_data/households.json"), "utf-8")
);

// Import data
const importData = async () => {
  try {
    await HouseholdModel.create(households);
    console.log(colors.green("Data Imported...").inverse);
    process.exit(0);
  } catch (err) {
    console.error(colors.red("Error importing data:"), err);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await HouseholdModel.deleteMany({});
    console.log("Data Destroyed...".red.inverse);
    process.exit(0);
  } catch (err) {
    console.error(colors.red("Error deleting data:"), err);
    process.exit(1);
  }
};

// Show help message
const showHelp = () => {
  console.log(colors.yellow("\nAvailable commands:"));
  console.log(colors.cyan("  npm run seed:import  - Add sample households to database"));
  console.log(colors.cyan("  npm run seed:delete  - Remove all households from database"));
  console.log(colors.cyan("  npm run seed         - Show this help message\n"));
  process.exit(0);
};

// Handle command line arguments
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
} else {
  showHelp();
} 