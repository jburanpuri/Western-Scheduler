//creating a schema for a course based on json object

const mongoose = require('mongoose'); //get mongoose to use schema
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    catalog_nbr: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    className: {
        type: String,
        required: true
    },
    course_info: [
        {
            class_nbr: {
                type: Number,
                required: true
            },
            start_time: {
                type: String,
                required: true
            },
            descrlong: {
                type: String,
            },
            end_time: {
                type: String,
                required: true
            },
            campus: {
                type: String,
                required: true
            },
            facility_ID: {
                type: String,
                required: true
            },
            days: [String],
            instructors: [String],
            class_section: {
                type: String
            },
            ssr_component: {
                type: String
            },
            enrl_stat: {
                type: String
            },
            descr: {
                type: String
            }
        }
    ],
    catalog_description: {
        type: String
    },
    reviews: [
        {
            name: {
                type: String
            },
            comment: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
});

const Course = mongoose.model('course', CourseSchema);
Course.createIndexes();
module.exports = Course;