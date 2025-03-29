import pool from "../../config/db.js";
import EnrollmentRequest from "./enrollment.js"
import User from "../../userManagement/model/user.js";

class EnrollmentRepository{
    constructor()
    {
        this.pool = pool;
    }

    async createEnrollmentRequest(courseID, studentID)
    {
        let connection = await this.pool.connect();
        try
        {
            const query = `INSERT INTO "enrollment_requests" (course_id, student_id) VALUES ($1, $2) RETURNING id`;
            const result = await connection.query(query, [courseID, studentID]);
            if(result.rows.length === 0)
            {
                return {success: false};
            }
            return {success: true};
        }
        catch(error)
        {
            console.error("Error in createEnrollmentRequest:", error.message);
            throw error;
        }
        finally
        {
            connection.release();
        }
    }

    async getEnrollmentRequests(courseID, instructorID)
    {
        let connection = await this.pool.connect();
        try
        {
            const query = `
            SELECT 
                e.id AS enrollment_request_id, 
                e.student_id, 
                u.first_name, 
                u.last_name, 
                u.email 
            FROM enrollment_requests e 
            JOIN users u ON e.student_id = u.id
            JOIN courses c ON e.course_id = c.id
            WHERE e.course_id = $1 AND c.instructor_id = $2`;

            const result = await connection.query(query, [courseID, instructorID]);
            if (result.rows.length === 0) 
            {
                throw new Error("No enrollment requests found");
            }

            const enrollmentRequests = result.rows.map(row => 
                new EnrollmentRequest({
                    id: row.enrollment_request_id,
                    student: new User({
                        id: row.student_id,
                        username: "", 
                        first_name: row.first_name, 
                        last_name: row.last_name, 
                        password: "",
                        email: row.email,
                        role: "STUDENT"
                    }),
                    course: courseID
                })
            );
            return {success:true , requests: enrollmentRequests};
        }
        catch(error)
        {
            console.error("Error in getEnrollmentRequests:", error.message);
            throw error;
        }
        finally
        {
            connection.release();
        }
    }

    async createEnrollment(enrollmentRequestID, instructorID)
    {
        let connection = await this.pool.connect();
        try
        {
            await connection.query("BEGIN");

            const deleteQuery = `
            DELETE FROM enrollment_requests e
            USING courses c
            WHERE e.id = $1 
            AND e.course_id = c.id 
            AND c.instructor_id = $2
            RETURNING e.course_id, e.student_id`;

            const deleteResult = await connection.query(deleteQuery, [enrollmentRequestID, instructorID]);
            if(deleteResult.rows.length === 0)
            {
                await connection.query("ROLLBACK");
                return {success: false};
            }

            const {course_id, student_id} = deleteResult.rows[0];
            const insertQuery = `INSERT INTO enrollments (course_id, student_id) VALUES ($1, $2) RETURNING id`;
            const insertResult = await connection.query(insertQuery, [course_id, student_id]);
            if(insertResult.rows.length === 0)
            {
                await connection.query("ROLLBACK");
                return {success: false};
            }

            await connection.query("COMMIT");
            return {success: true};
        }
        catch(error)
        {
            console.error("Error in createEnrollment:", error.message);
            await connection.query("ROLLBACK");
            throw error;
        }
        finally
        {
            connection.release();
        }
    }

    async deleteRequest(enrollmentRequestID, instructorID)
    {
        let connection = await this.pool.connect();
        try
        {
            const query = `
            DELETE FROM enrollment_requests e
            USING courses c
            WHERE e.id = $1
            AND e.course_id = c.id
            AND c.instructor_id = $2
            RETURNING e.id`;

            const result = await connection.query(query, [enrollmentRequestID, instructorID]);
            if(result.rows.length === 0)
            {
                return {success: false};
            }
            return {success: true};
        }
        catch(error)
        {
            console.error("Error in deleteRequest:", error.message);
            throw error;
        }
        finally
        {
            connection.release();
        }
    }

    async createEnrollmentByCode(enrollmentCode, studentID)
    {
        let connection = await this.pool.connect();
        try
        {
            const query = `SELECT id FROM courses WHERE enrollment_code = $1`;
            const result = await connection.query(query, [enrollmentCode]);
            if(result.rows.length === 0)
            {
                return {success: false};
            }
            const courseID = result.rows[0].id;
            const insertQuery = `INSERT INTO enrollments (course_id, student_id) VALUES ($1, $2) RETURNING id`;
            const insertResult = await connection.query(insertQuery, [courseID, studentID]);
            if(insertResult.rows.length === 0)
            {
                return {success: false};
            }
            return {success: true};
        }
        catch(error)
        {
            console.error("Error in createEnrollmentByCode:", error.message);
            throw error;
        }
        finally
        {
            connection.release();
        }
    }

    async getEnrolledStudents(courseID, instructorID)
    {
        let connection = await this.pool.connect();
        try
        {
            const checkAuthorizationResult = await connection.query('SELECT 1 FROM courses WHERE id = $1 AND instructor_id = $2', [courseID, instructorID]);
            if (checkAuthorizationResult.rowCount === 0) 
            {
                throw new Error("Unauthorized access");
            }

            const query = `SELECT u.id, u.first_name, u.last_name, u.email 
            FROM enrollments e JOIN users u ON e.student_id = u.id
            WHERE e.course_id = $1`;

            const result = await connection.query(query, [courseID]);
            if(result.rows.length === 0)
            {
                return {success: false};
            }
            const students = result.rows.map(row => 
                new User({
                    id: row.id,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    email: row.email,
                    role: "STUDENT"
                })
            );
            return {success: true, students: students.map(student => student.toJSON())};
        }
        catch(error)
        {
            console.error("Error in getEnrolledStudents:", error.message);
            throw error;
        }
        finally
        {
            connection.release();
        }
    }
}

export default EnrollmentRepository;