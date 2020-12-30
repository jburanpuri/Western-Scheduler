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

//get a single course - public 
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

//get course with course done in db -public
router.get('/search/query', async(req, res) => {
    try{
        const cata = req.query.code;
        const component = req.query.component;
        const key = req.query.key;
        const sub = req.query.subject;

        if(key){
            const courses = await Course.find({$text : { $search : key }});
            if(!courses || courses.length === 0){
                return res.status(404).json({errors: [{ msg: 'course not found 1' }] });
            }

            return res.json(courses);
        }
        else if(!cata && !component && !sub){
            const courses = await Course.find();
            if(!courses || courses.length === 0){
                return res.status(404).json({errors: [{ msg: 'course not found 2' }] });
            }

            return res.json(courses);
        }
        else if(cata && !component && !sub){
            const courses = await Course.find({ catalog_nbr: { "$regex": cata } });
            if(!courses || courses.length === 0){
                return res.status(404).json({errors: [{ msg: 'course not found 3' }] });
            }

            return res.json(courses);
        }
        else if(!cata && component && !sub){
            const courses = await Course.find({ course_info: { "$elemMatch" :{ssr_component: component}} });
            if(!courses || courses.length === 0){
                return res.status(404).json({errors: [{ msg: 'course not found 4' }] });
            }

            return res.json(courses);
        }
        else if(!cata && !component && sub){
            const courses = await Course.find({ subject: { "$regex": sub } });
            if(!courses || courses.length === 0){
                return res.status(404).json({errors: [{ msg: 'course not found 5' }] });
            }

            return res.json(courses);
        }
        else if(cata && component && !sub){
            const courses = await Course.find({ catalog_nbr: { "$regex": cata }, course_info: { "$elemMatch" :{ssr_component: component}} });
            if(!courses || courses.length === 0){
                return res.status(404).json({errors: [{ msg: 'course not found 6' }] });
            }

            return res.json(courses);
        }
        else if(cata && !component && sub){
            const courses = await Course.find({ catalog_nbr: { "$regex": cata }, subject: { "$regex": sub } });
            if(!courses || courses.length === 0){
                return res.status(404).json({errors: [{ msg: 'course not found 7' }] });
            }

            return res.json(courses);
        }
        else if(!cata && component && sub){
            const courses = await Course.find({ subject: { "$regex": sub }, course_info: { "$elemMatch" :{ssr_component: component}} });
            if(!courses || courses.length === 0){
                return res.status(404).json({errors: [{ msg: 'course not found 8' }] });
            }

            return res.json(courses);
        }
        else{
            const courses = await Course.find({ catalog_nbr: { "$regex": cata }, subject: { "$regex": sub }, course_info: { "$elemMatch" :{ssr_component: component}} });
            if(!courses || courses.length === 0){
                return res.status(404).json({errors: [{ msg: 'course not found 9' }] });
            }

            return res.json(courses);
        }
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//get all courses in a db - public 
router.put('/reviews/:id', auth,[
    check('comment').trim().escape()
], async(req, res) => {
    const { comment } = req.body;
    try{
        const commenter = await User.findById(req.user.id);

        const review = {
            name: commenter.name,
            comment
        }

        const course = await Course.findById(req.params.id);

        course.reviews.unshift(review);

        course.save();

        res.json(course);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
