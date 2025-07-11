const Field = require('../model/field');

const createField = async (req, res) => {
    try {
        const { name, area, crop , location , status , Last_Activity } = req.body;
        const userId = req.user.id;
        const field = await Field.create({ name, area, crop, userId , location , status , Last_Activity });
        res.status(201).json({ message: "Field created successfully", field });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getFields = async (req, res) => {
    try {
        const userId = req.user.id;
        const fields = await Field.findAll({ where: { userId } });
        res.status(200).json({ fields });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateField = async (req, res) => {
    try {
        const { id, name, area, crop , location , status , Last_Activity } = req.body;
        const userId = req.user.id;
        const field = await Field.findOne({ where: { id, userId } });
        if (!field) {
            return res.status(404).json({ message: "Field not found" });
        }
        field.name = name;
        field.area = area;
        field.crop = crop;
        field.location = location;
        field.status = status;
        field.Last_Activity = Last_Activity;
        await field.save();
        res.status(200).json({ message: "Field updated successfully", field });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteField = async (req, res) => {
    try {
        const { id } = req.body;
        const userId = req.user.id;
        const field = await Field.findOne({ where: { id, userId } });
        if (!field) {
            return res.status(404).json({ message: "Field not found" });
        }
        await field.destroy();
        res.status(200).json({ message: "Field deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const updateFieldStatus = async (req, res) => {
    try {
        const { id, status , Last_Activity } = req.body;
        const userId = req.user.id;
        const field = await Field.findOne({ where: { id, userId } });
        if (!field) {
            return res.status(404).json({ message: "Field not found" });
        }
        field.status = status;
        field.Last_Activity = Last_Activity;
        await field.save();
        res.status(200).json({ message: "Field status updated successfully", field });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteAllFields = async (req, res) => {
    try {
        const userId = req.user.id;
        await Field.destroy({ where: { userId } });
        res.status(200).json({ message: "All fields deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createField, getFields, updateField, deleteField, deleteAllFields, updateFieldStatus };