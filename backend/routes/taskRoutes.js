
import express from 'express';
import Task from '../models/Task.js';

const router = express.Router();


// CREATE TASK
router.post('/', async (req, res) => {
    try {
         console.log('Received request body:', req.body);
        const { title, description, date, startTime, endTime, priority } = req.body;

        const task = await Task.create({
            title,
            description,
            date,
            startTime,
            endTime,
            priority
        });

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: task
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// GET ALL TASKS
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ dateTime: 1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// SEARCH TASKS
router.get('/search', async (req, res) => {
    try {
        const { keyword } = req.query;

        if (!keyword || !keyword.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Search keyword is required'
            });
        }

        const tasks = await Task.find({
            $or: [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ]
        }).sort({ dateTime: 1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// GET SINGLE TASK
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.status(200).json({
            success: true,
            data: task
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Invalid task ID'
        });
    }
});


// UPDATE TASK
router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: task
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});


// UPDATE TASK STATUS
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        if (!['In Progress', 'Completed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid task status'
            });
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task status updated successfully',
            data: task
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});


// DELETE TASK
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Invalid task ID'
        });
    }
});

export default router;
