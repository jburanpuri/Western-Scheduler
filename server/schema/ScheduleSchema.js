//Uses mongoose to create schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScheduleSchema = new Schema({
    user: { //schedule stored under user
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    name: { //name of schedules
        type: String,
        required: true
    },
    desc: { //schedule des
        type: String
    },
    courses: [
        { //the courses in the schedule 
            type: Schema.Types.ObjectId,
            ref: 'course'
        }
    ],
    isPublic: { //schedule private or public 
        type: Boolean,
        default: false,
        required: true
    },
    modified: { //mofified or not
        type: Date,
        default: Date.now
    }
    
});

module.exports = Schedule = mongoose.model('schedule', ScheduleSchema);