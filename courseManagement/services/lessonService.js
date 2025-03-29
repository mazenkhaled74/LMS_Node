import Lesson from "../models/lesson.js";

class LessonSerivce
{
    constructor(lessonRepository)
    {
        this.lessonRepository = lessonRepository;
    }

    async createLesson(lessonData, courseID, files, instructorID)
    {
        try
        {
            const lesson = new Lesson({title: lessonData.title, description: lessonData.description, course_id: courseID});
            const result = await this.lessonRepository.saveLesson(lesson, courseID, files, instructorID);
            if(result.success)
            {
                return {success: true, lessonID: result.lessonID};
            }
            else
            {
                return {success: false};
            }
        }
        catch(error)
        {
            console.error("Error in createLesson:", error.message);
            throw error;
        }
    }

    async deleteLesson(lessonID, instructorID)
    {
        try
        {
            const result = await this.lessonRepository.deleteLesson(lessonID, instructorID);
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
            console.error("Error in deleteLesson:", error.message);
            throw error;
        }
    }

    async deleteLessonMedia(lessonID, mediaID, instructorID)
    {
        try
        {
            const result = await this.lessonRepository.deleteMedia(lessonID, mediaID, instructorID);
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
            console.error("Error in deleteLessonMedia:", error.message);
            throw error;
        }
    }

    async addMediaToLesson(lessonID, courseID, instructorID, file)
    {
        try
        {
            const result = await this.lessonRepository.addMedia(lessonID, courseID, file, instructorID);
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
            console.error("Error in addMediaToLesson:", error.message);
            throw error;
        }
    }

    async getCourseLessons(courseID, user)
    {
        try
        {
            let userID;
            if(user.role === 'STUDENT')
            {
                userID = {studentID: user.id};
            }
            else
            {
                userID = {instructorID: user.id};
            }
            const result = await this.lessonRepository.getLessonsByCourseID(courseID, userID);
            if(result.success)
            {
                return {success: true, lessons: result.lessons};
            }
            else
            {
                return {success: false};
            }
        }
        catch(error)
        {
            console.error("Error in getCourseLessons:", error.message);
            throw error;
        }
    }
}

export default LessonSerivce;