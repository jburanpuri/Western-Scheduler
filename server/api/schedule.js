const express = require('express');
const router = express.Router();
const auth = require('../authorization');
const Course = require('../../schema/Course');
const Schedule = require('../../schema/Schedule');
const { check, validationResult } = require('express-validator');

//get all schedules - public
router.get('/', auth, async(req, res) => {
    try{
        const schedules = await Schedule.find().populate('courses').sort({ modified: -1 });

        res.json(schedules);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//get schedules for specific user - public
router.get('/user', auth, async(req, res) => {
    try{
        const schedules = await Schedule.find({ user: req.user.id }).populate('courses').sort({ modified: -1 });

        res.json(schedules);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//get 15 latest schedules
router.get('/public', async (req, res) => {
    try{
        //returns latest 15 schedules 
        const schedules = await Schedule.find({ isPublic: true }).populate('courses').sort({ modified: -1 }).limit(15);
        res.json(schedules);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
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
        res.status(500).send('Server Error');
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
        res.status(500).send('Server Error');
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
        res.status(500).send('Server Error');
    }
});



 
