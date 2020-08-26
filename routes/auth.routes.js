const {Router} = require('express');
//to cache password and compare it
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const router = Router();
const User = require('../modules/User');

// /api/auth/register
router.post(
    '/register',
    //apply middleware to make data validation
    [
        check('email', 'Incorrect email').isEmail(),
        check('password', 'Min characters 6 symbols').isLength({min: 6})
    ],
    async (req, res) => {
        try {
            console.log(req.body);
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Check your login or password'
                })
            }
            const {email, password} = req.body;
            //try to find in base existed user
            const condidate = await User.findOne({email});

            if (condidate) {
                return res.status(400).json({message: "User already exist "});
            }
            //12 for complicated hashing
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({email, password: hashedPassword});

            await user.save();

            res.status(201).json({message: "User created"})

        } catch (e) {
            res.status(500).json({message: "Something went wrong..."})
        }
    });

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Incorrect email').normalizeEmail().isEmail(),
        check('password', 'Min characters 6 symbols').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Check your login or password'
                })
            };

            const {email, password} = req.body;

            const user = await User.findOne({email});

            if (!user) return res.status(400).json({message: 'User is undefined'});
            //compare password
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) return res.status(400).json({message: 'Password is incorrect'});

            //Create token
            const token = jwt.sign(
                {userId: user.id},
                config.get('jwtSecret'),
                { expiresIn: '1h'}
            );

            res.json({token, userId: user.id});

        } catch (e) {
            res.status(500).json({message: "Something went wrong..."})
        };
    });


module.exports = router;