const {signupvalidation,loginvalidation} = require('../Middlewares/AuthValidation');
const {signup,login} = require('../Controllers/AuthController');
const router = require('express').Router();
router.post('/signup',signupvalidation,signup);
router.post('/login',loginvalidation,login);

module.exports=router;