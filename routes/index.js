const express = require('express');
const router = express.Router();
const  { ensureAuth, ensureGuest } = require('../middleware/auth');

const Story = require('../models/Story');

router.use('/', require('./swagger'));
router.use('/contacts', require('./contacts'));

// login page
router.get('/', ensureGuest, (req, res) => {
    console.log('GET Home/login hit');
    res.render('login', {
        layout: 'login',
        title: 'Login'
    });
});

router.get('/login', (req, res) => {
    res.redirect('/');
});

// dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id }).lean();
        res.render('dashboard', {
            title: 'Dashboard',
            name: req.user.firstName, 
            user: req.user,
        stories
    });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});



module.exports = router;
