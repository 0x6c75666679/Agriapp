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

        role: {
            type: DataTypes.ENUM('user', 'admin'),
            defaultValue: 'user',
            allowNull: false,
        },

        profilePicture: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: function() {
                // Generate a random profile picture URL using DiceBear API
                const styles = ['avataaars', 'big-ears', 'bottts', 'croodles', 'fun-emoji', 'micah', 'miniavs', 'personas'];
                const randomStyle = styles[Math.floor(Math.random() * styles.length)];
                const randomSeed = Math.random().toString(36).substring(2, 15);
                return `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${randomSeed}`;
            }
        },

        tokenVersion: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
    },
    {
        timestamps: true,
    },
);

module.exports= UserAccount;