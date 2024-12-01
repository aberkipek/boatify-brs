USE boatify_db;

CREATE TABLE rentals (
    rental_id INT AUTO_INCREMENT PRIMARY KEY,
    boat_id INT NOT NULL,
    user_id INT NOT NULL,
    rental_start_date DATE NOT NULL,
    rental_end_date DATE NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (boat_id) REFERENCES boats(boat_id),
	FOREIGN KEY (user_id) REFERENCES users(user_id)
);
