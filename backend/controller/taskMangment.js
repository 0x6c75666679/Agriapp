const Task = require('../model/task');
const Field = require('../model/field');

const createTask = async (req, res) => {
    try {
        const { 
            title, 
            category, 
            fieldName, 
            notes, 
            startDate, 
            startTime, 
            dueDate, 
            dueTime, 
            priority, 
            status 
        } = req.body;
        console.log(req.body);
        
        if (!title || !fieldName || !startDate || !dueDate) {
            return res.status(400).json({ message: "Please fill all required parameters" });
        }
        
        const userId = req.user.id;
        
        // Find the field by name and userId to get fieldId
        const field = await Field.findOne({ where: { userId, name: fieldName } });
        if (!field) {
            return res.status(404).json({ message: "Field not found" });
        }
        
        // Combine date and time for start and due
        const startDateTime = startTime ? new Date(`${startDate}T${startTime}`) : new Date(startDate);
        const dueDateTime = dueTime ? new Date(`${dueDate}T${dueTime}`) : new Date(dueDate);
        
        const task = await Task.create({ 
            title, 
            category, 
            fieldId: field.id, // Use the found field's ID
            description: notes, 
            startDate: startDateTime,
            startTime,
            dueDate: dueDateTime,
            dueTime,
            priority, 
            status,
            userId
        });
        
        res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const tasks = await Task.findAll({ where: { userId } });
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getTasksByField = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(userId)
        const  fieldId  = req.body;
        console.log(fieldId)
        const tasks = await Task.findAll({ where: { userId, fieldId } });
        console.log(tasks)
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const statusUpdate = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id, status } = req.body;
        const task = await Task.findOne({ where: { userId, id } });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        task.status = status;
        await task.save();
        res.status(200).json({ message: "Task status updated successfully", task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteTask = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(req.body);
        const { id } = req.body;
        const task = await Task.findOne({ where: { userId, id } });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        await task.destroy();
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteAllTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        await Task.destroy({ where: { userId } });
        res.status(200).json({ message: "All tasks deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const { 
            id,
            title,
            type,
            field,
            description,
            startDate,
            startTime,
            dueDate,
            dueTime,
            priority,
            status
        } = req.body;
        
        const task = await Task.findOne({ where: { userId, id } });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        
        // Handle field update - find the field and get its ID
        let fieldId = task.fieldId;
        if (field) {
            const fieldRecord = await Field.findOne({ where: { userId, name: field } });
            if (!fieldRecord) {
                return res.status(404).json({ message: "Field not found" });
            }
            fieldId = fieldRecord.id;
        }
        
        // Handle date and time combinations
        let startDateTime = task.startDate;
        if (startDate && startTime) {
            startDateTime = new Date(`${startDate}T${startTime}`);
        } else if (startDate) {
            startDateTime = new Date(startDate);
        }
        
        let dueDateTime = task.dueDate;
        if (dueDate && dueTime) {
            dueDateTime = new Date(`${dueDate}T${dueTime}`);
        } else if (dueDate) {
            dueDateTime = new Date(dueDate);
        }
        
        // Update task with new values
        if (title !== undefined) task.title = title;
        if (type !== undefined) task.category = type;
        if (fieldId !== task.fieldId) task.fieldId = fieldId;
        if (description !== undefined) task.description = description;
        if (startDateTime !== task.startDate) task.startDate = startDateTime;
        if (startTime !== undefined) task.startTime = startTime;
        if (dueDateTime !== task.dueDate) task.dueDate = dueDateTime;
        if (dueTime !== undefined) task.dueTime = dueTime;
        if (priority !== undefined) task.priority = priority;
        if (status !== undefined) task.status = status;
        
        await task.save();
        res.status(200).json({ message: "Task updated successfully", task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createTask, getTasks, statusUpdate, deleteTask, updateTask, deleteAllTasks, getTasksByField };