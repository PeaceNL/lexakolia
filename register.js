const express = require("express");
const path = require("path");
// const db = require('./db');
const bodyParser = require('body-parser');
const register = express.Router();;
const util = require('util');
const { validator } = require('validator');
const { check, oneOf, validationResult } = require('express-validator');
const exp = require("constants");


const validation = [
    oneOf([
        check('nickname')
          .exists()
          .withMessage('nickname is required')
          .isLength({ min: 3 })
          .withMessage('wrong nickname length'),

        check('nickname')
          .exists()
          .withMessage('nickname is required')
          .isEmail()
          .withMessage('nickname not valid'),
    ]),
    check('password')
        .exists()
        .withMessage('password is required')
];

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(util.inspect(errors.array()));
    return res.status(402).json({ errors: errors.array() });
  }

  next();
};

// router
//   .post('/', validation, handleValidationErrors,
//     (req, res) => {
//       const isEmail = validator.isEmail(req.body.nickname);

//       res.status(200).json({ isEmail });
//     });

register.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'publick', 'registerPage.html'))
});

register.post('/', validation, handleValidationErrors, (req, res) => {
    const login = validator.isEmail(req.body.login);
    const {password} = req.body
    res.send(login)
})

module.exports = register;