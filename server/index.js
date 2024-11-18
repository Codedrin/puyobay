import express from 'express';
import dotenv from 'dotenv';
import dbcon from './config/dbcon.js'; // Adjusted relative path
import cors from 'cors';
import userRoutes from './routes/userRoutes.js'; 

const app = express();

dotenv.config();
dbcon();

app.use(cors());
app.use(express.json());

// Use user routes
app.use('/api/users', userRoutes); // Use the user routes for /api/users endpoint

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong on the server!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message, // Hide detailed error messages in production
  });
});

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
