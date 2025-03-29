CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title varchar(250) NOT NULL,
    description varchar(500),
    instructor_id INT NOT NULL,
    FOREIGN KEY (instructor_id) REFERENCES Users(id) ON DELETE CASCADE
);