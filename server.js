const express = require("express");
const app = express();
const path = require("path");
const db = require('./db');
const bodyParser = require('body-parser');
const {Client} = require('pg');
const register = require('./register.js');
const { error } = require("console");
const { check } = require('express-validator');
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
	check('login').notEmpty().withMessage('Login is required'),
	check('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    const {login, password} = req.body;
    const user = await client.query('SELECT * FROM registration WHERE login = $1', [login]);
    const loginInDB = user.rows[0].login;
    const passwordInDB = user.rows[0].pass;    
    
    if (login === loginInDB && password === passwordInDB) {
                res.send(`Zdarova ${login}`);  
    } else {
            res.status(404).send('opyat zalupa');
    }                    
    
})



app.listen(4001, () => console.log(`Сервер хуярит na 4001 porte`));


module.exports = register;