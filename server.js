const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require('body-parser')
PORT = 4001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
  }));
app.use(express.static(path.join(__dirname, 'publick')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'publick', 'gomapage.html'))
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'publick', 'loginPage.html'))
});

app.post('/login', (req, res) => {
    const login = req.body.login;

    
    res.send(`Zdarova ${login}`);
})
app.listen(4001, () => console.log(`Сервер хуярит na 400 porte`));
