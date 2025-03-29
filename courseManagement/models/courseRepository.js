import pool from "../../config/db.js";
import Course from "./course.js";
import User from "../../userManagement/model/user.js";
import crypto from "crypto";

class CourseRepository{
    constructor(){
        this.pool = pool;
    }

    async create(course, instructorID){
        let connection = await this.pool.connect();
        const MAX_RETRIES = 5;
        let retries = 0;

        try
        {
            while(retries < MAX_RETRIES)
            {
                try {
                    let enrollmentCode = crypto.randomBytes(6).toString("base64").replace(/[^a-zA-Z0-9]/g, '').substring(0, 8).toUpperCase();
                    const query = `INSERT INTO "courses" (title, description, instructor_id, enrollment_code) VALUES ($1, $2, $3, $4) RETURNING id`;
                    const values = [course.getTitle(), course.getDescription(), instructorID, enrollmentCode];
                    const result = await connection.query(query, values);
                    if(result.rows.length > 0)
                    {
                        return {success: true, courseId: result.rows[0].id};
                    }
                }
                catch (error) 
                {
                    const UNIQUE_VIOLATION = "23505";
                    if (error.code === UNIQUE_VIOLATION) 
                    {
                        console.warn(`Enrollment code conflict: retrying...`);
                        retries++;
                        continue;
                    }
                    throw error;
                }
            }
            throw new Error("Failed to generate a unique enrollment code");
        }
        catch(error)
        {
            console.error("Error in create course:", error.message);
            throw error;
        }
        finally
        {
            connection.release();
        }
    }

    async getCourseDetails(courseID)
    {
        let connection = await this.pool.connect();
        try
        {
            const query = `
            SELECT 
                c.id AS course_id, 
                c.title, 
                c.description, 
                i.id AS instructor_id, 
                i.first_name, 
                i.last_name, 
                i.email 
            FROM courses c 
            JOIN user i ON c.instructor_id = i.id 
            WHERE c.id = $1`;

            const result = await connection.query(query, [courseID]);
            if(result.rows.length === 0)
            {
                return null;
            }

            const instructor = new User({
                id: result.rows[0].instructor_id, username: "", 
                first_name: result.rows[0].first_name, 
                last_name: result.rows[0].last_name, 
                password: "",
                email: result.rows[0].email,
                role: "INSTRUCTOR"
            });

            const course = new Course({id: result.rows[0].course_id,
                title: result.rows[0].title,
                description: result.rows[0].description,
                instructor: instructor,
                students: [],
                lessons: []
            });

            return course;
        }
        catch(error)
        {
            console.error("Error in getCourse:", error.message);
            throw error;
        }
        finally
        {
            if(connection)
            {
                connection.release();
            }
        }
    }

    async getAllCourses()
    {
        let connection = await this.pool.connect();
        try
        {
            const query = `
            SELECT 
                c.id AS course_id, 
                c.title, 
                c.description, 
                i.id AS instructor_id, 
                i.first_name, 
                i.last_name, 
                i.email 
            FROM courses c 
            JOIN users i ON c.instructor_id = i.id`;

            const result = await connection.query(query);
            const courses = [];
            for(const row of result.rows)
            {
                const instructor = new User({
                    id: row.instructor_id, 
                    username: "", 
                    first_name: row.first_name, 
                    last_name: row.last_name, 
                    password: "",
                    email: row.email,
                    role: "INSTRUCTOR"
                });

                const course = new Course({id: row.course_id,
                    title: row.title,
                    description: row.description,
                    instructor: instructor,
                    students: [],
                    lessons: []
                });

                courses.push(course);
            }
            return courses;
        }
        catch(error)
        {
            console.error("Error in getAllCourses:", error.message);
            throw error;
        }
        finally
        {
            if(connection)
            {
                connection.release();
            }
        }
    }

    async update(courseID, courseData, instructorID)
    {
        let connection = await this.pool.connect();
        try
        {
            const fields = Object.keys(courseData);
            if (fields.length === 0) {
                return { success: false, message: "No fields provided for update" };
            }
    
            const setClause = fields.map((field, index) => `"${field}" = $${index + 1}`).join(", ");
            const values = [...fields.map(field => courseData[field]), courseID, instructorID];

            const query = `UPDATE "courses" SET ${setClause} WHERE id = $${fields.length + 1} AND instructor_id = $${fields.length + 2} RETURNING id`;
            const result = await connection.query(query, values);
            console.log("Update course: ",result);
            if(result.rows.length === 0)
            {
                return {success: false};
            }
            return {success: true};
        }
        catch(error)
        {
            console.error("Error in update:", error.message);
            throw error;
        }
        finally
        {
            if(connection)
            {
                connection.release();
            }
        }
    }

    async delete(courseID, instructorID)
    {
        let connection = await this.pool.connect();
        try
        {
            const query = 'DELETE FROM "courses" WHERE id = $1 AND instructor_id = $2 RETURNING id';
            const values = [courseID, instructorID];
            const result = await connection.query(query, values);
            if(result.rows.length === 0)
            {
                return {success: false};
            }
            return {success: true};
        }
        catch(error)
        {
            console.error("Error in delete:", error.message);
            throw error;
        }
        finally
        {
            if(connection)
            {
                connection.release();
            }
        }
    }

    async getEnrollmentCode(courseID, instructorID)
    {
        let connection = await this.pool.connect();
        try
        {
            const query = 'SELECT enrollment_code FROM "courses" WHERE id = $1 AND instructor_id = $2';
            const result = await connection.query(query, [courseID, instructorID]);
            if(result.rows.length === 0)
            {
                return null;
            }
            const course = new Course({id: courseID, enrollmentCode: result.rows[0].enrollment_code});
            return {success: true, course: course};
        }
        catch(error)
        {
            console.error("Error in getEnrollmentCode:", error.message);
            throw error;
        }
        finally
        {
            if(connection)
            {
                connection.release();
            }
        }
    }

}

export default CourseRepository;