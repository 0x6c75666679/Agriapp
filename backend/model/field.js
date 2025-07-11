const { DataTypes, UUIDV4 } = require('sequelize');
const { sequelize } = require('../db/database');

const Field = sequelize.define('Field', {
        id: {
            type : DataTypes.UUID,
            defaultValue : UUIDV4,
            primaryKey: true,
        },
        name: {
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
        location: {
            type : DataTypes.STRING,
            allowNull: false,
        },
        area: {
            type : DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        crop: {
            type : DataTypes.STRING,
            allowNull: true,
            defaultValue: 'None',
        },
        status: {
            type : DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Planting',
        },
        Last_Activity: {
            type : DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
    },
    {
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['userId', 'name']
            }
        ]
    },
);

module.exports= Field;