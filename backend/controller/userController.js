const User = require('../model/user');
const bcrypt = require('bcrypt');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// Helper function to generate default profile picture URL
const generateDefaultProfilePicture = () => {
    const styles = ['avataaars', 'big-ears', 'bottts', 'croodles', 'fun-emoji', 'micah', 'miniavs', 'personas'];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const randomSeed = Math.random().toString(36).substring(2, 15);
    return `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${randomSeed}`;
};

const register = async (req , res) => {
    console.log(req.body)
    const { email, username , password, role = 'user' } = req.body;

    if ( !username || !email || !password ) {
        return res.status(400).json({ message : "Please fill all the parameters "})
    }

    // Validate role
    if (role && !['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: "Role must be either 'user' or 'admin'" });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password , salt );
        
        // Generate default profile picture
        const defaultProfilePicture = generateDefaultProfilePicture();
        
        const newUser = await User.create({
            username,
            email,
            password: hashPassword,
            role: role,
            profilePicture: defaultProfilePicture
        });
        res.status(201).json({success:true, message: "User created", user: newUser });

    }catch (error) {
        res.status(500).json({message : "Internal server error"})
        console.log(error) 
    }
}

const login = async (req , res) => {
    
    try {
        const { email , password} = req.body;

        if (!password || !email) {
            return res.status(400).json({ message : "Please fill all the parameters "});
        }
        
        const user = await User.findOne({ where : {email}});
        if (!user){
            return res.status(403).json({ message : "Invalid credentials"});
        }
        
        const isRight = await bcrypt.compare(password , user.password);
        if(!isRight){
            return res.status(403).json({ message : "Invalid credentials"});
        }

        if (user && isRight){
            const token = jwt.sign(
                { 
                    id: user.id, 
                    role: user.role,
                    tokenVersion: user.tokenVersion || 0
                },
                process.env.JWT,
                {expiresIn:'24h'}
            )

            return res.status(200).json({
                success: true , message : "You have succesfully logged in" , token
            });
        }          
    }catch(err){
        res.status(500).json({message : "Internal Server Error"});
        console.log(err)
    }
}

const deleteUser   = async (req , res) => { 
    try{

        const userID = req.user.id;
        const { password } = req.body;

        const user = await User.findByPk(userID)
        if(!user){
            return res.status(500).json({ message : "Internal server error"})
        }

        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
            return res.status(403).json({ message : "Wrong password"})
        }

        await User.destroy({ where : {id: userID}})
        return res.status(200).json({ message : "The user has been deleted successfuly"});
    }catch(error){
        return res.status(500).json({message : " Internal server error"});
    }
}

const updateUser = async (req , res ) => {
    const id  = req.user.id;
    console.log(id)
    const { username , email , password } = req.body;
    try {
        if (!password) {
            return res.status(401).json({ message : "Please send the password"})
        }
        console.log(password);

        const user = await User.findByPk(id);
        console.log(user)
        if (!user) {
            return res.status(500).json({ message : "Internal server error"})
        }

        const isMatch = await bcrypt.compare(password , user.password)
        if(!isMatch) {
            return res.status(403).json({ message : "Incorrect Password"})
        }

        let updatefields = { username , email}

        await user.update(updatefields , {where: {id}})
        res.status(200).json({ message : "User has been updated"})



    }catch(err){
        res.status(500).json({ message : "Internal server error"})
        console.log(err)
    }
         
}

const updatePassword = async(req , res) => {
    try {
        const id = req.user.id;
        const { oldPassword , newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(401).json({ message : "Please fill all the passwords "})
        }

        const user =  await User.findByPk(id);
        console.log(user)
        if (!user) {
            return res.status(500).json({ message : "Internal server error"})
        }

        const isMatch = await bcrypt.compare(oldPassword , user.password)
        if(!isMatch) {
            return res.status(403).json({ message : "Incorrect Password"})
        }

        const isNewSameAsOld = await bcrypt.compare(newPassword, user.password);
        if (isNewSameAsOld) {
            return res.status(401).json({ message: 'New password cannot be the same as old password' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword , salt );

        user.password = hashPassword;
        await user.save();
        res.status(200).json({message: "Password has been change succefully"})

    }catch(err){
        res.status(500).json({ message : "Internal server error"})
        console.log(err)
    }

}

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] } // Don't send password
        });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User profile retrieved successfully",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.log('Error getting user profile:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// Admin Statistics
const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const activeUsers = await User.count({ where: { role: 'user' } });
        const inactiveUsers = await User.count({ where: { role: 'admin' } });
        
        // Get new users this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const newUsersThisMonth = await User.count({
            where: {
                createdAt: {
                    [Op.gte]: startOfMonth
                }
            }
        });

        res.status(200).json({
            stats: {
                totalUsers,
                activeUsers,
                inactiveUsers,
                newUsersThisMonth
            }
        });
    } catch (error) {
        console.error('Error getting admin stats:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Site Status
const getSiteStatus = async (req, res) => {
    try {
        // Check database connection
        let databaseStatus = 'online';
        try {
            await require('../db/database').sequelize.authenticate();
        } catch (dbError) {
            databaseStatus = 'offline';
        }

        const status = {
            database: databaseStatus,
            server: 'online',
            api: 'online',
            uptime: '99.9%',
            lastMaintenance: '2024-01-15'
        };

        res.status(200).json({ status });
    } catch (error) {
        console.error('Error getting site status:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get All Users (Admin)
const getAllUsers = async (req, res) => {
    console.log("getAllUsers")
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.status(200).json({ users });
    } catch (error) {
        console.error('Error getting all users:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update User Role
const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: "Role must be 'user' or 'admin'" });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Increment token version to invalidate existing tokens
        const newTokenVersion = (user.tokenVersion || 0) + 1;
        
        await user.update({ 
            role,
            tokenVersion: newTokenVersion
        });

        res.status(200).json({ 
            message: "User role updated successfully. User will need to log in again.",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                tokenVersion: newTokenVersion
            }
        });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete User (Admin)
const deleteUserAdmin = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.destroy();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// System Logs
const getSystemLogs = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        
        // Mock system logs (in a real app, you'd have a logs table)
        const logs = [
            {
                id: 1,
                level: 'info',
                message: 'Server started successfully',
                timestamp: new Date().toISOString(),
                userId: null
            },
            {
                id: 2,
                level: 'info',
                message: 'Database connection established',
                timestamp: new Date(Date.now() - 60000).toISOString(),
                userId: null
            },
            {
                id: 3,
                level: 'warn',
                message: 'High memory usage detected',
                timestamp: new Date(Date.now() - 120000).toISOString(),
                userId: null
            }
        ].slice(0, limit);

        res.status(200).json({ logs });
    } catch (error) {
        console.error('Error getting system logs:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Performance Metrics
const getPerformanceMetrics = async (req, res) => {
    try {
        // Mock performance metrics (in a real app, you'd get these from system monitoring)
        const metrics = {
            cpuUsage: Math.floor(Math.random() * 30) + 10, // 10-40%
            memoryUsage: Math.floor(Math.random() * 20) + 60, // 60-80%
            diskUsage: Math.floor(Math.random() * 15) + 45, // 45-60%
            responseTime: Math.floor(Math.random() * 50) + 10 // 10-60ms
        };

        res.status(200).json({ metrics });
    } catch (error) {
        console.error('Error getting performance metrics:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports={
    register,
    login,
    deleteUser,
    updateUser,
    updatePassword,
    getUserProfile,
    getUsers,
    getAdminStats,
    getSiteStatus,
    getAllUsers,
    updateUserRole,
    deleteUserAdmin,
    getSystemLogs,
    getPerformanceMetrics
}