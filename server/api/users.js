const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../schema/UserSchema');
const auth = require('../authorization');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

//creating user - public
router.post('/', [
    //express validator to sanitize input 
    check('name', 'Name is required').not().isEmpty().trim().escape(),
    check('email', 'Please include valid email').isEmail().normalizeEmail(),
    check('password', 'Please enter valid password').isLength({ min:6 }).trim().escape()
] , async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        }

        const { name, email, password } = req.body;
    try{
        //to see if the user exists already
        let user = await User.findOne({ email });
        if(user){
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }

        //create the user
        user = new User({
            name,
            email,
            password
        });
        //encryption salt
        const salt = await bcrypt.genSalt(10);
        //encrypt password
        user.password = await bcrypt.hash(password, salt);
        //save user to db
        await user.save();
        //retun jwt to authenticate 
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 3600 }, (err, token) => {
            if(err) throw err;
            res.json({ token });
        });

    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//admin gets the users - private (only admin can see)
router.get('/admin', auth, async (req, res) => {
    if(!req.user.isAdmin){
        return res.status(401).json({ errors: [{ msg: 'Unauthorized Request' }] });
    }
    try{
        const users = await User.find({ _id: { $nin: req.user.id } }).select('-password');
        res.json(users)
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

