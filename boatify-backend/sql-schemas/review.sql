USE boatify_db;

CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    boat_id INT NOT NULL,
    user_id INT NOT NULL,
    review_date DATE NOT NULL,
    rating TINYINT CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    FOREIGN KEY (boat_id) REFERENCES boats(boat_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
