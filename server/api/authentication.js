const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const consts = require('../global-constants')
const auth = require('../authentication');
const User = require('../schema/UserSchema');
const { check, validationResult } = require('express-validator');

//get user
router.get('/', auth, async (req, res) => {
    try{
       const user = await User.findById(req.user.id).select('-password');
        if(user.deactivated){
            return res.status(400).json({ errors: [{ msg: 'Account is deactivated' }] })
        }

       res.json(user);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//athenticate user and get token
router.post('/', [
    check('email', 'Please include valid email').isEmail().normalizeEmail(),
    check('password', 'Password is required').exists().trim().escape()
] , async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body;
    try{
        //to see if user already exists
        let user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
        }
        if(user.deactivated){
            return res.status(400).json({ errors: [{ msg: 'Account is deactivated. Please contact admin' }] })
        }
        
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] })
        }

        //jwt authentication 
        const payload = {
            user: {
                id: user.id,
                isAdmin: user.isAdmin
            }
        }

        jwt.sign(payload, consts.jwtSecretKey, { expiresIn: 3600 }, (err, token) => {
            if(err) throw err;
            res.json({ token, isAdmin: user.isAdmin });
        });

    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.post('/changePassword',auth, async (req, res)=>{
    const  { currentPassword, newPassword, confirmPassword } = req.body;
    
     if(newPassword !== confirmPassword)
     return  res.status(400).json({ errors: [{ msg: 'Passwords are not matched' }] });


     const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if(!isMatch){
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }


    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    return res.send();
});


module.exports = router; //export file



