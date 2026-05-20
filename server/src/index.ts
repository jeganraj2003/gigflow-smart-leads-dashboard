import app from './app.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Start Server Immediately (Required for Render Port Detection)
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  
  // Connect to Database after server starts
  connectDB().catch(err => {
    console.error('Database connection failed delayed:', err);
  });
});
