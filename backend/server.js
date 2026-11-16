
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/tasks', taskRoutes);

// MongoDB Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://yashraj3110:123yashraj@cluster0.r9jqgoo.mongodb.net/?authMechanism=SCRAM-SHA-1");

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name}`);

    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

// Test API
app.get('/test', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'running'
    });
});

// Start server after database connection
const startServer = async () => {
    await connectDB();

    const PORT = 5000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
