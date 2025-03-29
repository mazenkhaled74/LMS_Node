import pool from "../../config/db.js";
import Lesson from "./lesson.js";
import MediaManger from "../../utils/fileUploadService.js";
import Media from "./mediaFile.js";


class LessonRepository
{
    constructor()
    {
        this.pool = pool;
    }

    async saveLesson(lesson, courseID, files, instructorID)
    {
        let connection = await this.pool.connect();
        try
        {

            await connection.query('BEGIN');

            const checkAuthorizationResult = await connection.query('SELECT instructor_id FROM courses WHERE id = $1', [courseID]);
            if(checkAuthorizationResult.rowCount === 0 || checkAuthorizationResult.rows[0].instructor_id !== instructorID)
            {
                throw new Error("Unauthorized access");
            }

            const lessonInsertResult = await connection.query('INSERT INTO lessons (title, description, course_id) VALUES ($1, $2, $3) RETURNING id', [lesson.getTitle(), lesson.getDescription(), courseID]);
            const lessonID = lessonInsertResult.rows[0].id;


            const mediaFiles = await Promise.all(files.map(file => MediaManger.getPathAndType(file, lessonID)));

            const mediaInsertPromises = await Promise.all(mediaFiles.map(media => connection.query('INSERT INTO media (url, type, lesson_id) VALUES ($1, $2, $3)', [media.path, media.type, lessonID])));
            if(mediaInsertPromises.some(result => result.rowCount === 0))
            {
                throw new Error("Error inserting media files");
            }

            const fileSaveResults = await Promise.all(
                mediaFiles.map(media => MediaManger.saveFile(media.buffer, media.path))
            );

            if(fileSaveResults.includes(false))
            {
                throw new Error("Error saving media files");
            }

            await connection.query('COMMIT');
            return {success: true, lessonID: lessonID};
        }
        catch(error)
        {
            await connection.query('ROLLBACK');
            console.error("Error in saveLesson:", error.message);
            throw error;
        }
        finally
        {
            connection.release();
        }
    }

    async deleteLesson(lessonID, instructorID)
    {
        let connection = await this.pool.connect();
        try
        {
            await connection.query('BEGIN');
            const checkAuthorizationResult = await connection.query(`SELECT l.id FROM lessons l JOIN courses c ON l.course_id = c.id WHERE c.instructor_id = $1 AND l.id = $2`, [instructorID, lessonID]);
            if(checkAuthorizationResult.rowCount === 0)
            {
                throw new Error("Unauthorized access");
            }


            const deletionResult = await connection.query('DELETE FROM lessons WHERE id = $1 RETURNING id', [lessonID]);
            if(deletionResult.rowCount === 0)
            {
                throw new Error("Error deleting lesson");
            }

            const deletedLessonID = deletionResult.rows[0].id;

            const mediaDirectoryDeletionResult = await MediaManger.deleteDirectory(deletedLessonID);
            if(!mediaDirectoryDeletionResult)
            {
                throw new Error("Error deleting media directory");
            }

            await connection.query('COMMIT');
            return {success: true};
        }
        catch(error)
        {
            await connection.query('ROLLBACK');
            console.error("Error in deleteLesson:", error.message);
            throw error;
        }
        finally
        {
            connection.release();
        }
    }

    async deleteMedia(lessonID, mediaID, instructorID)
    {
        let connection = await this.pool.connect();
        try
        {
            await connection.query('BEGIN');
            const checkAuthorizationResult = await connection.query(`SELECT l.id FROM lessons l JOIN courses c ON l.course_id = c.id WHERE c.instructor_id = $1 AND l.id = $2`, [instructorID, lessonID]);
            if(checkAuthorizationResult.rowCount === 0)
            {
                throw new Error("Unauthorized access");
            }

            const deletionResult = await connection.query('DELETE FROM media WHERE id = $1 RETURNING url', [mediaID]);
            if(deletionResult.rowCount === 0)
            {
                throw new Error("Error deleting media");
            }

            const deletedMediaPath = deletionResult.rows[0].url;

            const mediaDeletionResult = await MediaManger.deleteFile(deletedMediaPath);
            if(!mediaDeletionResult)
            {
                throw new Error("Error deleting media file");
            }

            await connection.query('COMMIT');
            return {success: true};
        }
        catch(error)
        {
            await connection.query('ROLLBACK');
            console.error("Error in deleteMedia:", error.message);
            throw error;
        }
        finally
        {
            connection.release();
        }
    }

    async addMedia(lessonID, courseID, file, instructorID)
    {
        let connection = await this.pool.connect();
        try
        {
            await connection.query('BEGIN');
            const checkAuthorizationResult = await connection.query('SELECT instructor_id FROM courses WHERE id = $1', [courseID]);
            if(checkAuthorizationResult.rowCount === 0 || checkAuthorizationResult.rows[0].instructor_id !== instructorID)
            {
                throw new Error("Unauthorized access");
            }

            const mediaFile = await MediaManger.getPathAndType(file, lessonID);

            const mediaInsertResult = await connection.query('INSERT INTO media (url, type, lesson_id) VALUES ($1, $2, $3) RETURNING id', [mediaFile.path, mediaFile.type, lessonID]);
            const mediaID = mediaInsertResult.rows[0].id;

            const fileSaveResult = await MediaManger.saveFile(mediaFile.buffer, mediaFile.path);
            if(!fileSaveResult)
            {
                throw new Error("Error saving media file");
            }

            await connection.query('COMMIT');
            return {success: true, mediaID: mediaID};
        }
        catch(error)
        {
            await connection.query('ROLLBACK');
            console.error("Error in addMedia:", error.message);
            throw error;
        }
        finally
        {
            connection.release();
        }
    }

    async getLessonsByCourseID(courseID, user) {
        let connection = await this.pool.connect();
        try {
            if (user.instructorID) 
            {
                const checkAuthorizationResult = await connection.query('SELECT 1 FROM courses WHERE id = $1 AND instructor_id = $2', [courseID, user.instructorID]);
                if (checkAuthorizationResult.rowCount === 0) 
                {
                    throw new Error("Unauthorized access");
                }
            }
            else if (user.studentID) 
            {
                const checkAuthorizationResult = await connection.query('SELECT 1 FROM enrollments WHERE course_id = $1 AND student_id = $2', [courseID, user.studentID]);
                if (checkAuthorizationResult.rowCount === 0) 
                {
                    throw new Error("Unauthorized access");
                }
            }
    
            const query = `SELECT l.id AS lesson_id, l.title, l.description, l.course_id, m.id AS media_id, m.url, m.type 
                FROM lessons l
                LEFT JOIN media m ON l.id = m.lesson_id 
                WHERE l.course_id = $1
            `;
            const result = await connection.query(query, [courseID]);
    
            if (result.rowCount === 0) {
                return { success: false, lessons: [] };
            }
    
            const lessonsMap = new Map();
            result.rows.forEach(row => {
                if (!lessonsMap.has(row.lesson_id)) {
                    lessonsMap.set(row.lesson_id, new Lesson({
                        id: row.lesson_id,
                        title: row.title,
                        description: row.description,
                        content: []
                    }));
                }
    
                if (row.media_id)
                {
                    const media = new Media({
                        id: row.media_id,
                        url: row.url,
                        type: row.type
                    });
                    lessonsMap.get(row.lesson_id).getContent().push(media);
                }
            });
    
            return { success: true, lessons: Array.from(lessonsMap.values()).map(lesson => lesson.toJSON())};
        } 
        catch (error) 
        {
            console.error("Error in getCourseLessons:", error.message);
            throw error;
        } 
        finally 
        {
            connection.release();
        }
    }

}

export default LessonRepository;