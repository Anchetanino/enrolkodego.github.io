const express = require('express');
const router = express.Router();
const regController = require('../controllers/kodegoAccounts');

router.post('/login', regController.login);

router.post('/register', regController.register);
router.post('/add', regController.add);
router.post('/updateuser', regController.updateuser);
router.get('/deleteuser/:email', regController.deleteuser);
router.get('/update/form/:email', regController.update);
router.get('/logout', (req, res) => {
    res.clearCookie('access_token');
    res.render('login');
});
module.exports = router;