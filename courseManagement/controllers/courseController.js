import courseContainer from "../container.js";

class CourseController
{
    constructor(courseService)
    {
        this.courseService = courseService;
    }

    async createCourse(req, res)
    {
        try
        {
            const courseData = req.body;
            const instructorID = req.user.id;
            const result = await this.courseService.createCourse(courseData, instructorID);
            if(result.success === true)
            {
                return res.status(201).json({"message": "Course created successfully", "courseId": result.courseId});
            }
            else
            {
                throw new Error("Failed to create course");
            }
        }
        catch(error)
        {
            return res.status(400).json({"error": error.message});
        }
    }

    async listCourses(req, res)
    {
        try
        {
            const result = await this.courseService.getAllCourses();
            if(result.success !== true)
            {
                throw new Error("Failed to fetch courses");
            }
            const courses = result.courses.map(course => course.toJSON(["id", "title", "description", "instructor"]));
            return res.status(200).json({"courses": courses});
        }
        catch(error)
        {
            return res.status(400).json({"error": error.message});
        }
    }

    async updateCourse(req, res)
    {
        try
        {
            const courseID = req.params.id;
            const instructorID = req.user.id;
            const courseData = req.body;
            const result = await this.courseService.updateCourse(courseID, courseData, instructorID);
            if(result.success !== true)
            {
                throw new Error("Failed to update course");
            }
            return res.status(200).json({"message": "Course updated successfully"});
        }
        catch(error)
        {
            return res.status(400).json({"error": error.message});
        }
    }

    async deleteCourse(req, res)
    {
        try
        {
            const courseID = req.params.id;
            const instructorID = req.user.id;

            const result = await this.courseService.deleteCourse(courseID, instructorID);
            if(result.success !== true)
            {
                throw new Error("Failed to delete course");
            }
            return res.status(200).json({"message": "Course deleted successfully"});
        }
        catch(error)
        {
            return res.status(400).json({"error": error.message});
        }
    }

    async getEnrollmentCode(req, res)
    {
        try
        {
            const courseID = req.params.id;
            const instructorID = req.user.id;
            const result = await this.courseService.getEnrollmentCode(courseID, instructorID);
            if(result.success !== true)
            {
                throw new Error("Failed to get enrollment code");
            }
            return res.status(200).json({"enrollment_code": result.course.getEnrollmentCode()});
        }
        catch(error)
        {
            return res.status(400).json({"error": error.message});
        }
    }

    async enrollByRequest(req, res)
    {
        try
        {
            const courseID = req.params.id;
            const studentID = req.user.id;
            const result = await this.courseService.requestEnrollment(courseID, studentID);
            if(!result.success)
            {
                throw new Error("Failed to request enrollment");
            }
            return res.status(201).json({"message": "Enrollment request sent"});
        }
        catch(error)
        {
            return res.status(400).json({"error": error.message});
        }
    }

    async enrollByCode(req, res)
    {
        try
        {
            const {enrollment_code: enrollmentCode} = req.body;
            const studentID = req.user.id;
            const result = await this.courseService.enrollByCode(enrollmentCode, studentID);
            if(!result.success)
            {
                throw new Error("Failed to enroll");
            }
            return res.status(201).json({"message": "Enrolled successfully"});
        }
        catch(error)
        {
            return res.status(400).json({"error": error.message});
        }
    }

    async listRequests(req, res)
    {
        try
        {
            const courseID = req.params.id;
            const instructorID = req.user.id;
            const result = await this.courseService.listEnrollmentRequests(courseID, instructorID);
            if(!result.success)
            {
                throw new Error("Failed to list requests");
            }
            return res.status(200).json({"requests": result.requests.map(request => request.toJSON())});
        }
        catch(error)
        {
            return res.status(400).json({"error": error.message});
        }
    }

    async approveRequest(req, res)
    {
        try
        {
            const requestID = req.params.request_id;
            const instructorID = req.user.id;
            const result = await this.courseService.approveEnrollmentRequest(requestID, instructorID);
            if(!result.success)
            {
                throw new Error("Failed to approve request");
            }
            return res.status(200).json({"message": "Request approved"});
        }
        catch(error)
        {
            return res.status(400).json({"error": error.message});
        }
    }

    async rejectRequest(req, res)
    {
        try
        {
            const requestID = req.params.request_id;
            const instructorID = req.user.id;
            const result = await this.courseService.rejectEnrollmentRequest(requestID, instructorID);
            if(!result.success)
            {
                throw new Error("Failed to reject request");
            }
            return res.status(200).json({"message": "Request rejected"});
        }
        catch(error)
        {
            return res.status(400).json({"error": error.message});
        }
    }
    
    async listEnrolledStudents(req, res)
    {
        try
        {
            const courseID = req.params.id;
            const instructorID = req.user.id;
            const result = await this.courseService.getEnrolledStudents(courseID, instructorID);
            if(!result.success)
            {
                throw new Error("Failed to list enrolled students");
            }
            return res.status(200).json({"students": result.students});
        }
        catch(error)
        {
            return res.status(400).json({"error": error.message});
        }
    }
}


const courseController = new CourseController(courseContainer.getCourseService());
export default courseController;