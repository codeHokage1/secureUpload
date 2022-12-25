const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
            // useFindAndModify: false,
            // useCreateIndex: true,
        })
        console.log("Connected to DB")
    } catch (error) {
        console.error(error.message)
    }
}

module.exports = connectDB;