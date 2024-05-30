const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
module.exports = function(req, res, next) {
    if (req.method === "OPTIONS"){
        return next();
    }    
    try {
        const authHeader = req.cookies.accessToken;
        console.log(authHeader);
        if (!authHeader) {
            return res.status(401).json({ message: 'Пользователь не авторизован: отсутствует заголовок Authorization' });
        }
        
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Пользователь не авторизован: токен не найден' });
        }  
        
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);        
        req.user = decode;
        console.log('Мидлвейр прошёл успешно перебрасывает на некст!');
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({message: 'Пользователь не авторизован'});
    }
}