import Course from "../models/course.js";

class CourseService{
    constructor(courseRepository, enrollmentRepository){
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    async createCourse(courseData, instructorID){
        try
        {
            const course = new Course({title: courseData.title, description: courseData.description});
            const result = await this.courseRepository.create(course, instructorID);
            if(result.success){
                return {success: true, courseId: result.courseId};
            }
            else 
            {
                return {success: false};
            }
        }
        catch(error)
        {
            console.error("Error in createCourse:", error.message);
            throw error;
        }
    }

    async getAllCourses()
    {
        try
        {
            const courses = await this.courseRepository.getAllCourses();
            if(courses.length === 0)
            {
                return {success: false};
            }
            return {success: true, courses: courses};
        }
        catch(error)
        {
            console.error("Error in listAllCourses:", error.message);
            throw error;
        }
    }

    async deleteCourse(courseID, instructorID)
    {
        try
        {
            const result = await this.courseRepository.delete(courseID, instructorID);
            if(result.success)
            {
                return {success: true};
            }
            else
            {
                return {success: false};
            }
        }
        catch(error)
        {
            console.error("Error in deleteCourse:", error.message);
            throw error;
        }
    }

    async updateCourse(courseID, courseData, instructorID)
    {
        try
        {
            const result = await this.courseRepository.update(courseID, courseData, instructorID);
            if(result.success)
            {
                return {success: true};
            }
            else
            {
                return {success: false};
            }
        }
        catch(error)
        {
            console.error("Error in updateCourse:", error.message);
            throw error;
        }
    }

    async getEnrollmentCode(courseID, instructorID)
    {
        try
        {
            const course = await this.courseRepository.getEnrollmentCode(courseID, instructorID);
            if(!course)
            {
                return null;
            }
            return course;
        }
        catch(error)
        {
            console.error("Error in getEnrollmentCode:", error.message);
            throw error;
        }
    }

    async requestEnrollment(courseID, studentID)
    {
        try
        {
            const result = await this.enrollmentRepository.createEnrollmentRequest(courseID, studentID);
            if(result.success)
            {
                return {success: true};
            }
            else
            {
                return {success: false};
            }
        }
        catch(error)
        {
            console.error("Error in requestEnrollment:", error.message);
            throw error;
        }
    }

    async listEnrollmentRequests(courseID, instructorID)
    {
        try
        {
            const result = await this.enrollmentRepository.getEnrollmentRequests(courseID, instructorID);
            if(!result.success)
            {
                return {success: false};
            }
            return {success: true, requests: result.requests};
        }
        catch(error)
        {
            console.error("Error in listEnrollmentRequests:", error.message);
            throw error;
        }
    }

    async approveEnrollmentRequest(requestID, instructorID)
    {
        try
        {
            const result = await this.enrollmentRepository.createEnrollment(requestID, instructorID);
            if(result.success)
            {
                return {success: true};
            }
            else
            {
                return {success: false};
            }
        }
        catch(error)
        {
            console.error("Error in approveEnrollmentRequest:", error.message);
            throw error;
        }
    }

    async rejectEnrollmentRequest(requestID, instructorID)
    {
        try
        {
            const result = await this.enrollmentRepository.deleteRequest(requestID, instructorID);
            if(result.success)
            {
                return {success: true};
            }
            else
            {
                return {success: false};
            }
        }
        catch(error)
        {
            console.error("Error in rejectEnrollmentRequest:", error.message);
            throw error;
        }
    }

    async enrollByCode(enrollmentCode, studentID)
    {
        try
        {
            const result = await this.enrollmentRepository.createEnrollmentByCode(enrollmentCode, studentID);
            if(result.success)
            {
                return {success: true};
            }
            else
            {
                return {success: false};
            }
        }
        catch(error)
        {
            console.error("Error in enrollByCode:", error.message);
            throw error;
        }
    }

    async getEnrolledStudents(courseID, instructorID)
    {
        try
        {
            const result = await this.enrollmentRepository.getEnrolledStudents(courseID, instructorID);
            if(result.success)
            {
                return {success: true, students: result.students};
            }
            else
            {
                return {success: false};
            }
        }
        catch(error)
        {
            console.error("Error in getEnrolledStudents:", error.message);
            throw error;
        }
    }
}

export default CourseService;