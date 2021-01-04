const mongoose = require('mongoose');
const consts = require('../global-constants')
const seed = require('./seed');

const connectToDb = async () => {
    try{
        //async connection to mongodb
        await mongoose.connect(consts.mongoAtlasUrl, { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
         });

         await seed.seedDocs();

        console.log('MongoDB connected and seeded...');
    }
    catch(err){
        console.error(err.message);
        //Exit application with error
        process.exit(1);
    }
}

module.exports = connectToDb;