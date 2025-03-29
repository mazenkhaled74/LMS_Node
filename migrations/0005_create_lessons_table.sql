CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    title varchar(250) NOT NULL,
    description varchar(500),
    course_id INT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);