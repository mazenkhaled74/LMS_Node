CREATE TABLE attendance_otp (
    id SERIAL PRIMARY KEY,
    course_id INT NOT NULL,
    otp_code VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);
