const User = require('../model/user');
const bcrypt = require('bcrypt');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

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
                { id: user.id, role: user.role},
                process.env.JWT,
                {expiresIn:'1h'}
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
        const { password , newPassword , confirmPassowrd } = req.body;

        if (!password || !newPassword || !confirmPassowrd) {
            return res.status(401).json({ message : "Please fill all the passwords "})
        }

        const user =  await User.findByPk(id);
        console.log(user)
        if (!user) {
            return res.status(500).json({ message : "Internal server error"})
        }

        const isMatch = await bcrypt.compare(password , user.password)
        if(!isMatch) {
            return res.status(403).json({ message : "Incorrect Password"})
        }

        if (newPassword !== confirmPassowrd) {
            return res.status(401).json({ message: 'New password and confirm password do not match' });
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

const uploadProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id;
        
        if (!req.file) {
            return res.status(400).json({ message: "No profile picture uploaded" });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete old profile picture if it exists and is not a default one
        if (user.profilePicture && !user.profilePicture.startsWith('https://api.dicebear.com')) {
            try {
                const oldPicturePath = path.join(__dirname, '..', user.profilePicture);
                if (fs.existsSync(oldPicturePath)) {
                    fs.unlinkSync(oldPicturePath);
                }
            } catch (error) {
                console.log('Error deleting old profile picture:', error);
            }
        }

        // Create the URL path for the uploaded image
        const pathParts = req.file.destination.split('/');
        const userFolder = pathParts[pathParts.length - 2]; // Get the user folder name (second to last part)
        const imageUrl = `/uploads/${userFolder}/profile/${req.file.filename}`;
        
        // Update user with new profile picture path
        await user.update({ profilePicture: imageUrl });

        res.status(200).json({
            message: "Profile picture uploaded successfully",
            profilePicture: imageUrl
        });

    } catch (error) {
        console.log('Error uploading profile picture:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

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

module.exports={
    register,
    login,
    deleteUser,
    updateUser,
    updatePassword,
    uploadProfilePicture,
    getUserProfile
}