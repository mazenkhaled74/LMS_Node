import courseContainer from "../container.js";

class LessonController
{
    constructor(lessonService)
    {
        this.lessonService = lessonService;
    }

    async createLesson(req, res)
    {
        try
        {
            const lessonData = req.body;
            const courseID = req.params.id;
            const files = req.files["media"];
            const instructorID = req.user.id;
            const result = await this.lessonService.createLesson(lessonData, courseID, files, instructorID);
            if(result.success === true)
            {
                return res.status(201).json({"message": "Lesson created successfully", "lessonID": result.lessonID});
            }
            else
            {
                throw new Error("Failed to create lesson");
            }
        }
        catch(error)
        {
            return res.status(400).json({"error": error.message});
        }
    }

    async deleteLesson(req, res)
    {
        try
        {
            const lessonID = req.params.lesson_id;
            const instructorID = req.user.id;
            const result = await this.lessonService.deleteLesson(lessonID, instructorID);
            if(result.success === true)
            {
                return res.status(200).json({"message": "Lesson deleted successfully"});
            }
            else
            {
                throw new Error("Failed to delete lesson");
            }
        }
        catch(error)
        {
            return res.status(400).json({"error": error.message});
        }
    }
    
    async deleteLessonMedia(req, res)
    {
        try
        {
            const lessonID = req.params.lesson_id;
            const mediaID = req.params.media_id;
            const instructorID = req.user.id;
            const result = await this.lessonService.deleteLessonMedia(lessonID, mediaID, instructorID);
            if(result.success)
            {
                return res.status(200).json({"message": "Media content deleted successfully"});
            }
            else
            {
                throw new Error("Failed to delete media");
            }
        }
        catch(error)
        {
            return res.status(400).json({"error": error.message});
        }
    }

    async addLessonMedia(req, res)
    {
        try
        {
            const lessonID = req.params.lesson_id;
            const file = req.file;
            const instructorID = req.user.id;
            const courseID = req.params.id;
            const result = await this.lessonService.addMediaToLesson(lessonID, courseID, instructorID, file);
            if(result.success)
            {
                return res.status(200).json({"message": "Media content added successfully", "media_id": result.mediaID});
            }
            else
            {
                throw new Error("Failed to add media");
            }
        }
        catch(error)
        {
            return res.status(400).json({"error": error.message});
        }
    }

    async getCourseLessons(req, res)
    {
        try
        {
            const courseID = req.params.id;
            const user = req.user;
            const result = await this.lessonService.getCourseLessons(courseID, user);
            if(result.success)
            {
                return res.status(200).json({"lessons": result.lessons});
            }
            else
            {
                throw new Error("Failed to get lessons");
            }
        }
        catch(error)
        {
            return res.status(400).json({"error": error.message});
        }
    }
}

const lessonController = new LessonController(courseContainer.getLessonService());
export default lessonController;