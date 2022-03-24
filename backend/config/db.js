const mongoose = require("mongoose");

const conectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB Connected : ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error : ${error.message} ` );
        process.exit();
    }
}

module.exports = conectDB;