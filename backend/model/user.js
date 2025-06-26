const { DataTypes, UUIDV4 } = require('sequelize');
const { sequelize } = require('../db/database');

const UserAccount = sequelize.define('User', {
        id: {
            type : DataTypes.UUID,
            defaultValue : UUIDV4,
            primaryKey: true,
        },

        username: {
            type : DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        email: {
            type : DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        password: {
            type : DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: true,
    },
);

module.exports= UserAccount;