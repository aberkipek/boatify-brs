USE boatify_db;

CREATE TABLE sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    expires INT,
    data TEXT
);
