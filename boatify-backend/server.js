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

// MySQLStore Configuration
const sessionStore = new MySQLStore({
    createDatabaseTable: false,
    table: 'sessions',
    expiration: 1000 * 60 * 5, //MySQLStore expiration to clean up expired sessions from the database, expiration time (5 minutes)
    checkExpirationInterval: 1000 * 60 * 2, // Cleans expired sessions every 2 minutes
}, connection);

// Session Middleware Configuration
app.use(session({
    key: 'session_cookie_name',
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 5, // Session cookie expiration for client-side logout, expiration time (5 minutes)
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

app.get('/getUsername', (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        const sqlQuery = 'SELECT username FROM users WHERE username = ?';
        connection.query(sqlQuery, [username], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'User does not exist' });
            }
            return res.status(200).json({
                message: 'User exists',
                username: results[0].username
            });
        });
    } catch (error) {
        console.error('Error during fetching username:', error);
        res.status(500).json({ message: 'Error processing request' });
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

app.post('/addboat', (req, res) => {
    const { boat_name, boat_price, boat_size, boat_image_path, boat_type, boat_description } = req.body;

    const sqlQuery = `
        INSERT INTO boats (boat_name, boat_price, boat_size, boat_image_path, boat_type, boat_description)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    connection.query(sqlQuery, [boat_name, boat_price, boat_size, boat_image_path, boat_type, boat_description], (err, results) => {
        if (err) {
            console.error('Error adding boat:', err);
            return res.status(500).json({ message: 'Error adding boat to the database' });
        }
        res.status(201).json({ message: 'Boat added successfully!', boatId: results.insertId });
    });
});

app.get('/boats', (req, res) => {
    const sqlQuery = `
        SELECT *
        FROM boats b
        WHERE NOT EXISTS (
            SELECT 1
            FROM rentals r
            WHERE r.boat_id = b.boat_id
        );
    `;

    connection.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error fetching available boats:', err);
            return res.status(500).json({ message: 'Error fetching available boats' });
        }
        res.status(200).json(results);
    });
});

app.post('/rentals', (req, res) => {
    const userId = req.session.userId;
    const { boat_id, user_id, rental_start_date, rental_end_date, total_price } = req.body;

    const sqlQuery = `
        INSERT INTO rentals (boat_id, user_id, rental_start_date, rental_end_date, total_price)
        VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(sqlQuery, [boat_id, user_id, rental_start_date, rental_end_date, total_price], (err, results) => {
        if (err) {
            console.error('Error inserting rental:', err);
            return res.status(500).json({ message: 'Error saving rental to the database' });
        }

        res.status(201).json({
            rental_id: results.insertId,
            message: 'Rental created successfully.',
        });
    });
});

app.delete('/rentals/:rental_id', (req, res) => {
    const rentalId = req.params.rental_id;

    const deleteRentalQuery = `
        DELETE FROM rentals WHERE rental_id = ?;
    `;

    connection.query(deleteRentalQuery, [rentalId], (err, results) => {
        if (err) {
            console.error('Error deleting rental:', err);
            return res.status(500).json({ message: 'Error deleting rental' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Rental not found' });
        }

        res.status(200).json({ message: 'Rental deleted successfully' });
    });
});

app.get('/rentals-with-boats', (req, res) => {
    const userId = req.session.userId;

    const sqlQuery = `
        SELECT rentals.rental_id, rentals.boat_id, rentals.user_id, rentals.rental_start_date,
               rentals.rental_end_date, rentals.total_price, 
               boats.boat_name, boats.boat_image_path, boats.boat_price, boats.boat_size, boats.boat_type, boats.boat_description
        FROM rentals
        JOIN boats ON rentals.boat_id = boats.boat_id
        WHERE rentals.user_id = ?;
    `;

    connection.query(sqlQuery, [userId], (error, results) => {
        if (error) {
            console.error('Error fetching rentals with boats:', error);
            return res.status(500).json({ message: 'Error fetching rentals with boats' });
        }
        res.json(results);
    });
});

app.post('/reviews', (req, res) => {
    const userId = req.session.userId;
    const { boat_id, review_date, rating, review_text } = req.body;

    const sqlQuery = `
        INSERT INTO reviews (boat_id, user_id, review_date, rating, review_text)
        VALUES (?, ?, ?, ?, ?);
    `;

    connection.query(
        sqlQuery,
        [boat_id, userId, review_date, rating, review_text],
        (error, results) => {
            if (error) {
                console.error('Error submitting review:', error);
                return res.status(500).json({ message: 'Error submitting review' });
            }
            res.json({ message: 'Review submitted successfully', reviewId: results.insertId });
        }
    );
});

app.get('/reviews', (req, res) => {
    const userId = req.session.userId;

    const sqlQuery = `
        SELECT r.review_id, r.boat_id, r.review_date, r.rating, r.review_text, b.boat_name
        FROM reviews r
        JOIN boats b ON r.boat_id = b.boat_id
        WHERE r.user_id = ?
        ORDER BY r.review_date DESC;
    `;

    connection.query(sqlQuery, [userId], (error, results) => {
        if (error) {
            console.error('Error fetching reviews:', error);
            return res.status(500).json({ message: 'Error fetching reviews' });
        }
        res.json(results);
    });
});

app.put('/reviews/:id', (req, res) => {
    const { id } = req.params;
    const { rating, review_text } = req.body;

    const sqlQuery = `
        UPDATE reviews
        SET rating = ?, review_text = ?
        WHERE review_id = ?
    `;

    connection.query(
        sqlQuery,
        [rating, review_text, id, req.session.userId],
        (error, results) => {
            if (error) {
                console.error('Error updating review:', error);
                return res.status(500).json({ message: 'Error updating review' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Review not found or permission denied' });
            }
            res.json({ message: 'Review updated successfully' });
        }
    );
});

app.delete('/reviews/:id', (req, res) => {
    const { id } = req.params;

    const sqlQuery = `
        DELETE FROM reviews
        WHERE review_id = ? AND user_id = ?;
    `;

    connection.query(
        sqlQuery,
        [id, req.session.userId],
        (error, results) => {
            if (error) {
                console.error('Error deleting review:', error);
                return res.status(500).json({ message: 'Error deleting review' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Review not found or permission denied' });
            }
            res.json({ message: 'Review deleted successfully' });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
