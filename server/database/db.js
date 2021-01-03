const mongoose = require('mongoose');
const consts = require('../global-constants')


const connectToDb = async () => {
    try{
        //async connection to mongodb
        await mongoose.connect(consts.mongoAtlasUrl, { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
         });
        console.log('MongoDB connected...');
    }
    catch(err){
        console.error(err.message);
        //Exit application with error
        process.exit(1);
    }
}

module.exports = connectToDb;