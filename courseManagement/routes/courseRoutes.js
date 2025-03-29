import express from "express";
import courseController from "../controllers/courseController.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import lessonController from "../controllers/lessonController.js";
import multer from "multer";


const courseRouter = express.Router();
const upload = multer({storage: multer.memoryStorage()});


// Instructor routes
courseRouter.post("/create", authMiddleware.authorize(process.env.JWT_SECRET, ["INSTRUCTOR"]), courseController.createCourse.bind(courseController));
courseRouter.put("/:id", authMiddleware.authorize(process.env.JWT_SECRET, ["INSTRUCTOR"]), courseController.updateCourse.bind(courseController));
courseRouter.delete("/:id", authMiddleware.authorize(process.env.JWT_SECRET, ["INSTRUCTOR"]), courseController.deleteCourse.bind(courseController));
courseRouter.get("/:id/enrollmentCode", authMiddleware.authorize(process.env.JWT_SECRET, ["INSTRUCTOR"]), courseController.getEnrollmentCode.bind(courseController));
courseRouter.get("/:id/requests", authMiddleware.authorize(process.env.JWT_SECRET, ["INSTRUCTOR"]), courseController.listRequests.bind(courseController));
courseRouter.post("/:id/approve-request/:request_id", authMiddleware.authorize(process.env.JWT_SECRET, ["INSTRUCTOR"]), courseController.approveRequest.bind(courseController));
courseRouter.post("/:id/reject-request/:request_id", authMiddleware.authorize(process.env.JWT_SECRET, ["INSTRUCTOR"]), courseController.rejectRequest.bind(courseController));
courseRouter.post('/:id/lessons', authMiddleware.authorize(process.env.JWT_SECRET, ["INSTRUCTOR"]), upload.fields([{name: "media", maxCount:10}]), lessonController.createLesson.bind(lessonController));
courseRouter.delete('/:id/lessons/:lesson_id', authMiddleware.authorize(process.env.JWT_SECRET, ["INSTRUCTOR"]), lessonController.deleteLesson.bind(lessonController));
courseRouter.delete('/:id/lessons/:lesson_id/media/:media_id', authMiddleware.authorize(process.env.JWT_SECRET, ["INSTRUCTOR"]), lessonController.deleteLessonMedia.bind(lessonController));
courseRouter.post('/:id/lessons/:lesson_id/media', authMiddleware.authorize(process.env.JWT_SECRET, ["INSTRUCTOR"]), upload.single("media"), lessonController.addLessonMedia.bind(lessonController));
courseRouter.get('/:id/enrolled', authMiddleware.authorize(process.env.JWT_SECRET, ["INSTRUCTOR"]), courseController.listEnrolledStudents.bind(courseController));

// Student routes
courseRouter.get("/list", authMiddleware.authorize(process.env.JWT_SECRET, ["STUDENT"]), courseController.listCourses.bind(courseController));
courseRouter.post("/:id/request-enrollment", authMiddleware.authorize(process.env.JWT_SECRET, ["STUDENT"]), courseController.enrollByRequest.bind(courseController));
courseRouter.post("/:id/enroll", authMiddleware.authorize(process.env.JWT_SECRET, ["STUDENT"]), courseController.enrollByCode.bind(courseController));

// common routes
courseRouter.get('/:id/lessons', authMiddleware.authorize(process.env.JWT_SECRET, ["INSTRUCTOR", "STUDENT"]), lessonController.getCourseLessons.bind(lessonController));


export default courseRouter;