const mongoose = require("mongoose")
// const URI="mongodb://127.0.0.1:27017/fitness-buddy";
const URI = process.env.MONGO_URI 

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
    try {
        await mongoose.connect(URI)
        console.log("Database Connected")
    } catch (error) {
        console.log("Database connection failed:", error)
        process.exit(1)
    }
}
module.exports = connectDB