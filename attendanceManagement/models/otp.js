class OTP {
    #id;
    #course_id;
    #code;
    #created_at;
    #expires_at;

    constructor({ id = null, course_id, code, created_at, expires_at }) {
        this.#id = id;
        this.#course_id = course_id;
        this.#code = code;
        this.#created_at = created_at;
        this.#expires_at = expires_at;
    }

    getId() {
        return this.#id;
    }

    getCourseId() {
        return this.#course_id;
    }

    getCode() {
        return this.#code;
    }

    getCreatedAt() {
        return this.#created_at;
    }

    getExpiresAt() {
        return this.#expires_at;
    }

    setCourseId(course_id) {
        this.#course_id = course_id;
    }

    setCode(code) {
        this.#code = code;
    }

    setCreatedAt(created_at) {
        this.#created_at = created_at;
    }

    setExpiresAt(expires_at) {
        this.#expires_at = expires_at;
    }

    toJSON() {
        return {
            id: this.#id,
            code: this.#code,
        };
    }
}

export default OTP;
