const express = require("express");
const path = require("path");
// const db = require('./db');
const bodyParser = require('body-parser');
const register = express.Router();;
const util = require('util');
const { Client} = require('pg');
const { check, validationResult} = require('express-validator');
const exp = require("constants");
const bcrypt = require('bcrypt');


const client = new Client({
	user: 'postgres',
	password: 'postgres',
	host: 'localhost',
	port: '5432',
	database: 'register',
});

client
	.connect()
	.then(() => {
		console.log('Connected to PostgreSQL database');
	})
	.catch((err) => {
		console.error('Error connecting to PostgreSQL database', err);
	});

const loginPassValidation = [
	check('login')
	  .isAlphanumeric().withMessage('Логин может содержать только буквы и цифры')
	  .isLength({ min: 3 }).withMessage('Логин должен быть длинее 3 символов'),
		check('password')
	  .isLength({ min: 6 }).withMessage('Пароль должен быть длинее 6 символов')
	];

register.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'publick', 'registerPage.html'))
});

register.post('/', loginPassValidation, async (req, res) => {
	const { login, password } = req.body;

	const result = validationResult(req);
	if (!result.isEmpty()){
		res.status(400).json({message: result.errors[0].msg});
		return;
	}	
	
    try {
		const user = await client.query('SELECT * FROM registration WHERE login = $1', [login]);		
		if (user.rows.length > 0) {
			res.json({message: `Логин ${user.rows[0].login} уже существует`});
		} else {
			const hashPassword = await bcrypt.hash(password, 10);
			await client.query('INSERT INTO registration(login, pass) VALUES ($1,$2)',[login, hashPassword]);
			res.status(201).json({message: `Акаунт успешно создан!`});
		}
        
    } catch (e) {
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = register;