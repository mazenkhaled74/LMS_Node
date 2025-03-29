import CourseRepository from "./models/courseRepository.js";
import CourseService from "./services/courseService.js";
import EnrollmentRepository from "./models/enrollmentRepository.js";
import LessonSerivce from "./services/lessonService.js";
import LessonRepository from "./models/lessonRepository.js";

class CourseContainer{
    #courseService;
    #lessonSerivce;

    constructor()
    {
        const courseRepository = new CourseRepository();
        const enrollmentRepository = new EnrollmentRepository();
        const lessonRepository = new LessonRepository();
        this.#lessonSerivce = new LessonSerivce(lessonRepository);
        this.#courseService = new CourseService(courseRepository, enrollmentRepository);
    }

    getCourseService(){
        return this.#courseService;
    }

    getLessonService(){
        return this.#lessonSerivce;
    }
}

const courseContainer = new CourseContainer();
export default courseContainer;