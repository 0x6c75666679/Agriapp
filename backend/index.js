const express = require('express');
const { connectDB , sequelize } = require('./db/database');
require("dotenv").config();

// Import all models to register them with Sequelize
require('./model/user');
require('./model/task');
require('./model/field');

const app = express();
const cors = require('cors')

PORT = process.env.PORT || 9696;

app.use(cors({
    credentials: true,
    origin:['http://localhost:5174','http://localhost:5173', 'http://127.0.0.1']
})
)

app.use(express.json());

app.get('/' , (req , res) =>{
    res.send("This is the main page");
});

app.use('/api/user' , require('./route/userRoute'));
app.use('/api/weather' , require('./route/weatherRoute'));
app.use('/api/task' , require('./route/taskRoute'));
app.use('/api/field' , require('./route/fieldRoute'));

const startServer = async() => {
    await connectDB();
    await sequelize.sync({alter: true});

    app.listen(PORT , () =>{
        console.log(`Server is running on port http://localhost:${PORT}`);
    });


};

startServer();