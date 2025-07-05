const { DataTypes, UUIDV4 } = require('sequelize');
const { sequelize } = require('../db/database');

const Task = sequelize.define('Task', {
        id: {
            type : DataTypes.UUID,
            defaultValue : UUIDV4,
            primaryKey: true,
        },
        title: {
            type : DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        category: {
            type: DataTypes.ENUM('watering', 'fertilization', 'monitoring', 'harvesting'),
            defaultValue: 'monitoring',
            allowNull: false,
        },

        fieldId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Fields',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        description: {
            type : DataTypes.TEXT,
            allowNull: true,
        },
        startDate: {
            type : DataTypes.DATE,
            allowNull: false,
        },
        startTime: {
            type : DataTypes.TIME,
            allowNull: true,
        },
        dueDate: {
            type : DataTypes.DATE,
            allowNull: false,
        },
        dueTime: {
            type : DataTypes.TIME,
            allowNull: true,
        },
        priority: {
            type: DataTypes.ENUM('low', 'medium', 'high'),
            defaultValue: 'low',
            allowNull: false,
        },
        status: {   
            type: DataTypes.ENUM('Planned','In-Progress', 'Started', 'Completed'),
            allowNull: false,
            defaultValue: 'Planned',
        },
    },
    {
        timestamps: true,
    },
);

module.exports= Task;