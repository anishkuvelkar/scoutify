const Joi = require('joi');

const signupvalidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        lastname: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required(),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ 
            message: "Bad Request", 
            errors: error.details.map(err => err.message) // Extract readable error messages
        });
    }
    
    next(); // Proceed if validation is successful
};

const loginvalidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required(),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ 
            message: "Bad Request", 
            errors: error.details.map(err => err.message)
        });
    }
    
    next();
};

module.exports = {
    loginvalidation,
    signupvalidation
};
