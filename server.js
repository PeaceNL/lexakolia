const express = require("express");
const app = express();
const path = require("path");
const db = require('./db');
const bodyParser = require('body-parser');
const {Client} = require('pg');
const register = require('./register.js');
const { error } = require("console");
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const client = new Client({
	user: 'postgres',
	password: 'postgres',
	host: 'localhost',
	port: '5432',
	database: 'register',
});

PORT = 4001;
client
	.connect()
	.then(() => {
		console.log('Connected to PostgreSQL database');
	})
	.catch((err) => {
		console.error('Error connecting to PostgreSQL database', err);
	});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
  }));

app.use(express.static(path.join(__dirname, 'publick')));
app.use('/register', register); 


app.get('/', (req, res) => {    
    res.sendFile(path.join(__dirname, 'publick', 'gomapage.html'))
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'publick', 'loginPage.html'))
});

app.post('/login',[
	check('login', 'Заполните поле логина').notEmpty(),
	check('password', "Ввведите пароль").notEmpty()
], async (req, res) => {
    const {login, password} = req.body;
	try {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			return res.status(400).json({message: result.errors[0].msg});			
		}
    	const user = await client.query('SELECT * FROM registration WHERE login = $1', [login]);
		if (user.rows.length > 0) {			
    		const passwordInDB = user.rows[0].pass;
			const isMatch = await bcrypt.compare(password, passwordInDB);
			if (isMatch) {
				res.status(202).json({message: `Zdarova ${login}`});
			}  else {
				res.status(404).json({message: 'Неверный пароль!'});
			}   
		} else {
			res.status(404).json({message: 'User not found!'});
		}
    	
	} catch (e) {		
		res.status(500).json({message: 'Ошибка сервера'});
	}                  
    
})



app.listen(4001, () => console.log(`Сервер хуярит na 4001 porte`));


module.exports = register;