//use mongoose for schema 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocSchema = new Schema({
    title: { //name or type of file
        type: String,
        required: true
    },
    content: { //content inside the file 
        type: String,
        required: true
    },
    modified: { //date modified 
        type: Date,
        default: Date.now
    }
});

module.exports = Doc = mongoose.model('doc', DocSchema); //accessing doc from db