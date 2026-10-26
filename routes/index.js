const express = require('express');
const router = express.Router();

router.use('/', require('./swagger'));
router.use('/contacts', require('./contacts'));

// home page
router.get('/', (req, res) => {
    console.log('GET /home page git');
    res.render('home');
});

// login page
router.get('/login', (req, res) => {
    console.log('GET /login hit');
    res.render('login', {
        layout: 'login',
    });
});

// dashboard
router.get('/dashboard', (req, res) => {
    console.log('GET /dashboard hit');
    res.render('dashboard')
});

// mounting the other routers
router.use('/', require('./swagger'));
router.use('/contacts', require('./contacts'));

module.exports = router;
