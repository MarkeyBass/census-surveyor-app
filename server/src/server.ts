import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import householdRoutes from './routes/households';
import colors from "colors";

// Load environment variables
dotenv.config({ path: "./src/config/config.env" });

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/census-surveyor';
mongoose.connect(MONGODB_URI)
  .then(() => console.log(colors.inverse.underline('Connected to MongoDB')))
  .catch((error) => console.error(colors.red('MongoDB connection error:'), error));

// Routes
app.use('/api/v1/households', householdRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(colors.inverse.underline(`Server is running on port ${PORT}...`));
}); 