const express = require('express');
const auth = require('../authorization');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const Course = require('../../schema/Course');
const User = require('../../schema/User');

//get all courses in db - public 
router.get('/', async(req, res) => {
    try{
        console.log('working')
        const courses = await Course.find()
        res.json(courses);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//get a single course -public 
router.get('/:id', auth, async(req, res) => {
    try{
        const course = await Course.findById(req.params.id);
        if(!course) {
            return res.status(404).json({errors: [{ msg: 'course not found' }] });
        }
        res.json(course);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


