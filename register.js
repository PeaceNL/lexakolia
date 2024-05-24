const express = require("express");
const path = require("path");
// const db = require('./db');
const bodyParser = require('body-parser');
const register = express.Router();;
const util = require('util');
const { Client} = require('pg');
const { validator } = require('validator');
const { check, oneOf, validationResult } = require('express-validator');
const exp = require("constants");


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

register.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'publick', 'registerPage.html'))
});

register.post('/', async (req, res) => {    
    const { login, password } = req.body;
    try {
        await client.query('INSERT INTO registration(login, pass) VALUES ($1,$2)',[login, password]);
    } catch (e) {
        console.err(e)
    }
    
    res.redirect(`/login`);
});

module.exports = register;