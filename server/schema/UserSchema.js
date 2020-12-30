//schema for users 
//mongoose from mongodb used for schema 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { //user name
        type: String,
        required: true
    },
    email: { //email
        type: String,
        required: true,
        unique: true
    },
    password: { //password
        type: String,
        required: true
    },
    date: { //date registered 
        type: Date,
        default: Date.now
    },
    isAdmin: { //admin status 
        type: Boolean,
        default: false
    },
    deactivated: { //activation status 
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = User = mongoose.model('user', UserSchema);