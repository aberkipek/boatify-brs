USE boatify_db;
 
CREATE TABLE boats (
    boat_id INT AUTO_INCREMENT PRIMARY KEY,
    boat_name VARCHAR(255) NOT NULL,
    boat_price DECIMAL(10, 2) NOT NULL,
    boat_size VARCHAR(100) NOT NULL,
    boat_image_path VARCHAR(255) NOT NULL,
    boat_type ENUM('sailboat','motor boat','fishing boat') NOT NULL,
    boat_description TEXT NOT NULL
);