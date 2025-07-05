const Field = require('../model/field');

const createField = async (req, res) => {
    try {
        const { name, area, latitude, longitude, crop } = req.body;
        const userId = req.user.id;
        const field = await Field.create({ name, area, crop, userId });
        res.status(201).json({ message: "Field created successfully", field });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getFields = async (req, res) => {
    try {
        const fields = await Field.findAll();
        res.status(200).json({ fields });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createField, getFields };