const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Декодируем токен
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Находим пользователя по id
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ message: 'Не авторизован, токен недействителен' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Нет токена, авторизация отклонена' });
    }
};

module.exports = { protect };
