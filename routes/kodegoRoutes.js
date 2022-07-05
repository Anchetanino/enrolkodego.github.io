const express = require('express');
const router = express.Router();

router.get('/', (req, res) => { res.render('login') });
router.get('/register', (req, res) => { res.render('register') });
router.get('/list', (req, res) => { res.render('list') });
router.get('/add', (req, res) => { res.render('add') });
router.get('/updateuser', (req, res) => { res.render('update-form') });
module.exports = router;