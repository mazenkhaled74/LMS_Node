CREATE TABLE media(
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK(type IN ('image', 'video', 'document', 'spreadsheet', 'presentation', 'other')),
    lesson_id INT NOT NULL,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);