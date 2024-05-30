const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const {Client} = require('pg');
const register = require('./register.js');
const { error, log } = require("console");
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const midleware = require("./midleware.js");

dotenv.config();
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


const createAccessToken = (login, role) => {
	const payload = {
		login,
		role
	};
	const a = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: "15m"});
	console.log(a);
	return a;
}	
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
  }));
app.use(cookieParser());
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
			const token = createAccessToken(user.rows[0].login, user.rows[0].role);		
    		const passwordInDB = user.rows[0].pass;
			const isMatch = await bcrypt.compare(password, passwordInDB);
			if (isMatch) {
				console.log('вошёл');
				res.cookie('accessToken', `Bearer ${token}`, { httpOnly: true, secure: true, sameSite: 'none' });
				res.status(202).json({message: `Zdarova ${login}`});			
			}  else {
				console.log('не тот пароль');
				res.status(404).json({message: 'Неверный пароль!'});
			}   
		} else {
			console.log('нет логина');
			res.status(404).json({message: 'User not found!'});
		}
    	
	} catch (e) {		
		res.status(500).json({message: 'Ошибка сервера'});
	}                  
    
});

app.get('/users', midleware, (req, res) => {
	res.sendFile(path.join(__dirname, 'publick', 'users.html'));	
 });
 


app.listen(4001, () => console.log(`Сервер хуярит na 4001 porte`));


module.exports = register;