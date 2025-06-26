const { request } = require('express');
const { v4: uuidv4 } = require('uuid');
const User = require('../model/user');
const bcrypt = require('bcrypt');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const { where } = require('sequelize');
const { verify } = require('../middleware/jwtVerify');
const { use } = require('../route/userRoute');


const register = async (req , res) => {
    const { email, username , password } = req.body;

    if ( !username || !email || !password ) {
        return res.status(400).json({ message : "Please fill all the parameters "})
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password , salt );
        
        const newUser = await User.create({
            username,
            email,
            password: hashPassword
        });
        res.status(200).json({message : "User "+newUser.username+" has been created succesfully"})

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
                { id: user.id, email:user.email},
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
        nobdanobda
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

module.exports={
    register,
    login,
    deleteUser,
    updateUser,
    updatePassword
}