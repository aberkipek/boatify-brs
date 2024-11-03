const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const connection = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

const defaultRoleId = 1;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(bodyParser.json());

const sessionStore = new MySQLStore({}, connection);

app.use(session({
    key: 'session_cookie_name',
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false
    }
}));

app.post('/register', async (req, res) => {
    const { firstName, lastName, email, phone, username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sqlQuery = `
            INSERT INTO users 
            (first_name, last_name, email, phone_number, username, password_hash, role_id, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `;
        connection.query(sqlQuery, [firstName, lastName, email, phone, username, hashedPassword, defaultRoleId], (err) => {
            if (err) {
                console.error('Error registering user:', err);
                return res.status(500).json({ message: 'Error registering user' });
            }
            res.status(201).json({ message: 'User registered successfully!' });
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ message: 'Error processing registration' });
    }
});

app.post('/login', async (req, res) => {
    const { identifier, password } = req.body;

    if (req.session.userId) {
        return res.status(400).json({ message: 'You are already logged in. Please log out before logging in again.' });
    }

    try {
        const sqlQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
        connection.query(sqlQuery, [identifier, identifier], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (results.length === 0) {
                return res.status(401).json({ message: 'User does not exist' });
            }

            const user = results[0];
            const match = await bcrypt.compare(password, user.password_hash);
            if (!match) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            req.session.userId = user.user_id;
            req.session.fullName = `${user.first_name} ${user.last_name}`;
            req.session.username = user.username;
            req.session.role = user.role_id === 1 ? 'Customer' : 'Admin';

            const createdAtDate = new Date(user.created_at);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            req.session.since = new Intl.DateTimeFormat('en-US', options).format(createdAtDate);

            return res.status(200).json({
                message: 'Login successful',
                user: {
                    userId: user.user_id,
                    fullName: req.session.fullName,
                    username: req.session.username,
                    role: req.session.role,
                    since: req.session.since
                }
            });
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Error processing login' });
    }
});

app.post('/logout', (req, res) => {
    if (req.session.userId) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ message: 'Error logging out' });
            }
            res.clearCookie('session_cookie_name');
            return res.status(200).json({ message: 'Logged out successfully' });
        });
    } else {
        return res.status(400).json({ message: 'No active session to log out' });
    }
});

app.get('/session', (req, res) => {
    if (req.session.userId) {
        return res.status(200).json({ userId: req.session.userId, fullName: req.session.fullName, username: req.session.username, role: req.session.role, since: req.session.since });
    }
    res.status(401).json({ message: 'No active session' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
