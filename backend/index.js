const express = require('express');
const { connectDB , sequelize } = require('./db/database');
require("dotenv").config();
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


const startServer = async() => {
    await connectDB();
    await sequelize.sync({alter:false});

    app.listen(PORT , () =>{
        console.log(`Server is running on port http://localhost:${PORT}`);
    });


};

startServer();