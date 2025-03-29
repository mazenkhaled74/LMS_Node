CREATE TABLE attendance(
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    otp_id INT NOT NULL,
    marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (otp_id) REFERENCES attendance_otp(id) ON DELETE CASCADE
);