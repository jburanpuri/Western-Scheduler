const express = require('express');
const router = express.Router();
const auth = require('../authentication');
const Course = require('../schema/CourseSchema');
const Schedule = require('../schema/ScheduleSchema');
const { check, validationResult } = require('express-validator');

//get all schedules - public
router.get('/', auth, async(req, res) => {
    try{
        const schedules = await Schedule.find().populate('courses').sort({ modified: -1 });

        res.json(schedules);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

//get schedules for specific user - public
router.get('/user', auth, async(req, res) => {
    try{
        const schedules = await Schedule.find({ user: req.user.id }).populate('courses').populate('user').sort({ modified: -1 });

        res.json(schedules);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

//get 10 latest schedules
router.get('/public', async (req, res) => {
    try{
        //returns latest 15 schedules 
        const schedules = await Schedule.find({ isPublic: true }).populate('courses').populate('user').sort({ modified: -1 }).limit(10);
        res.json(schedules);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Internal Server Error')
    }
});

//get schedule by name
router.get('/:id', auth, async(req, res) => {
    let id = req.params.id;
    try{
        const schedule = await Schedule.findById(id).populate('courses');
        if(!schedule){
            return res.status(404).json({ errors: [{ msg: 'Schedule does not exist' }] });
        }

        res.json(schedule);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

//update scheudle with ID  public
router.put('/update/:id', auth, [
    check('name', 'Please enter a valid name').not().isEmpty().trim().escape(),
    check('desc').trim().escape()
],async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, desc, isPublic } = req.body
    try{
        const body = {
            name,
            desc,
            isPublic,
            modified: Date.now()
        }

        let schedule = await Schedule.findOneAndUpdate({ user: req.user.id, _id: req.params.id }, body, {new: true});
        if(!schedule){
            return res.status(400).json({ errors: [{ msg: 'Schedule does not exist' }] });
        }

        res.json(schedule);
        
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

//delete all schedules -public
router.delete('/', auth,async(req, res) => {
    try{
        await Schedule.deleteMany({ user: req.user.id });

        res.json('All schedules deleted');
        
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

//delete specific schedule by id - public
router.delete('/delete/:id', auth,async(req, res) => {
    try{
        const id = req.params.id;

        await Schedule.findOneAndDelete({ user: req.user.id, _id: req.params.id });

        res.json('Schedule Deleted');
        
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

//add or update course in schedule - public 
router.put('/courses/add/:id', auth, async (req, res) => {
    const { courseId } = req.body
    try{
        let schedule = await Schedule.findOne({ user: req.user.id, _id: req.params.id });
        if(!schedule){
            return res.status(404).send('Schedule not found');
        }
        const newSchedule = schedule.courses.filter(course => { 
            const test = course._id != courseId
            return test
        });
        schedule.courses = newSchedule;
        schedule.courses.push({ _id: courseId });

        await schedule.save();

        schedule = await Schedule.findOne({ user: req.user.id, _id: req.params.id }).populate('courses');
        if(!schedule){
            return res.status(404).send('Schedule not found');
        }
        res.json(schedule);
    }
    catch(err){
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

//create new schedule - public
router.post('/', auth,[
    check('name', 'Please enter a valid name').not().isEmpty().trim().escape(),
    check('desc').trim().escape()
],async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }

    let { name, desc, isPublic } = req.body
    try{
        let schedule = await Schedule.findOne({ user: req.user.id, name });
        if(schedule){
            return res.status(400).json({ errors: [{ msg: 'Schedule already exists' }] });
        }

        schedule = new Schedule({
            user: req.user.id,
            name,
            desc,
            isPublic
        });

        await schedule.save();

        res.json(schedule);
        
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//remove course from schedule using id
router.delete('/courses/delete/:schedule/:id', auth, async (req, res) => {
    try{
        let schedule = await Schedule.findOne({ user: req.user.id, _id: req.params.schedule });
        
        if(!schedule){
            return res.status(404).send('Schedule not found');
        }

        const newSchedule = schedule.courses.filter(course => {
            const test = course._id != req.params.id
            return test
        });
        schedule.courses = newSchedule;

        await schedule.save();

        schedule = await Schedule.findOne({ user: req.user.id, _id: req.params.schedule }).populate('courses');
        if(!schedule){
            return res.status(404).send('Schedule not found');
        }
        res.json(schedule);
    }
    catch(err){
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router; //exporting schedule.js
 
