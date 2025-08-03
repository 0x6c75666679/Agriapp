const  { Sequelize } = require("sequelize");
require("dotenv").config();

const isTestenviroment = process.env.NODE_ENV === 'test';

console.log(`the runnning is ${isTestenviroment ? 'Test' : 'Development'} mode`)


const sequelize = new Sequelize(
    isTestenviroment ? process.env.TEST_DB_NAME : process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,{
    host : process.env.DB_HOST,
    dialect:"mysql",
    logging : false
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(`Database connected successfully to ${isTestenviroment ? 'test' : 'development'} database.`);
        
        // Sync database in test environment
        if (isTestenviroment) {
            await sequelize.sync({ force: true }); // This will drop and recreate tables
            console.log('Test database synced successfully');
        }
    } catch (error) {
        console.error("Unable to connect:", error.message);
        throw error;
    }
};

module.exports = {
    sequelize,
    connectDB,
}