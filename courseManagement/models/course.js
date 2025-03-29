class Course{
    #id;
    #title;
    #description;
    #instructor;
    #lessons;
    #students;
    #enrollmentCode;

    constructor({id= null, title, description, instructor, lessons = [], students = [], enrollmentCode}){
        this.#id = id;
        this.#title = title;
        this.#description = description;
        this.#instructor = instructor;
        this.#lessons = lessons;
        this.#students = students;
        this.#enrollmentCode = enrollmentCode;
    }

    getId(){
        return this.#id;
    }

    getTitle(){
        return this.#title;
    }

    getDescription(){
        return this.#description;
    }

    getInstructor(){
        return this.#instructor;
    }

    getLessons(){
        return this.#lessons;
    }

    getStudents(){
        return this.#students;
    }

    setTitle(title){
        this.#title = title;
    }

    setDescription(description){
        this.#description = description;
    }

    setInstructor(instructor){
        this.#instructor = instructor;
    }

    setLessons(lessons){
        this.#lessons = lessons;
    }

    setStudents(students){
        this.#students = students;
    }

    getEnrollmentCode(){
        return this.#enrollmentCode;
    }

    toJSON(fields = [])
    {
        const courseData = {
            id: this.#id,
            title: this.#title,
            description: this.#description,
            instructor: this.#instructor.toJSON(["id", "firstName", "lastName", "email"]),
            lessons: this.#lessons.map(lesson => lesson.toJSON()),
            students: this.#students.map(student => student.toJSON()),
            enrollmentCode: this.#enrollmentCode
        };

        if(fields.length === 0){
            return courseData;
        }

        return Object.fromEntries(
            Object.entries(courseData).filter(([key]) => fields.includes(key))
        );
    }
}

export default Course;