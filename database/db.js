const mongoose = require('mongoose');

const url = "mongodb+srv://<username>:<password>@somedatabase.cpqvrrt.mongodb.net/?retryWrites=true&w=majority";

const connectDB = async () => 
{
    try {
        mongoose.set('strictQuery',true);
        await mongoose.connect(url,
            {
                useNewUrlParser: true,
            });
            console.log('connected...')
    }
    catch (err) {
        console.log(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;

