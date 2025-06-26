const express = require('express');
const { connectDB , sequelize } = require('./db/database');
require("dotenv").config();
const app = express();

PORT = process.env.PORT || 9696;

app.use(express.json());

app.get('/' , (req , res) =>{
    res.send("This is the main page");
});

app.use('/api/user' , require('./route/userRoute'));


const startServer = async() => {
    await connectDB();
    await sequelize.sync();

    app.listen(PORT , () =>{
        console.log(`Server is running on port http://localhost:${PORT}`);
    });


};

startServer();