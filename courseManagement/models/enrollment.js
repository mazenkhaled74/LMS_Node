class EnrollmentRequest {
    #id;
    #student;
    #course_id;

    constructor({id = null, student, course}){
        this.#id = id;
        this.#student = student;
        this.#course_id = course;
    }

    getId(){
        return this.#id;
    }

    getStudent(){
        return this.#student;
    }

    getCourse(){
        return this.#course_id;
    }

    setId(id){
        this.#id = id;
    }

    setStudent(student){
        this.#student = student;
    }

    setCourse(course){
        this.#course_id = course;
    }

    toJSON(){
        return {
            id: this.#id,
            student: this.#student.toJSON(["id", "name", "email", "first_name", "last_name"]),
        };
    }
}

export default EnrollmentRequest;