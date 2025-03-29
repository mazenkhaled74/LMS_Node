class User {
    #id;
    #username;
    #firstName;
    #lastName;
    #password;
    #email;
    #role;

    constructor({ id = null, username, first_name, last_name, password, email, role }) {
        this.#id = id;
        this.#username = username;
        this.#firstName = first_name;
        this.#lastName = last_name; 
        this.#password = password;
        this.#email = email;
        this.#role = role;
    }

    // Getters
    getId() { return this.#id; }
    getUsername() { return this.#username; }
    getFirstName() { return this.#firstName; }
    getLastName() { return this.#lastName; }
    getPassword() { return this.#password; }
    getEmail() { return this.#email; }
    getRole() { return this.#role; }

    // Setters
    setUsername(username) { this.#username = username; }
    setFirstName(firstName) { this.#firstName = firstName; }
    setLastName(lastName) { this.#lastName = lastName; }
    setPassword(password) { this.#password = password; }
    setEmail(email) { this.#email = email; }
    setRole(role) { this.#role = role; }

    toJSON(fields = []) {
        const userData = {
            id: this.#id,
            username: this.#username,
            firstName: this.#firstName,
            lastName: this.#lastName,
            email: this.#email,
            role: this.#role
        };
    
        // If no specific fields are requested, return all
        if (fields.length === 0){
            return userData;
        }
    
        // Return only the requested fields
        return Object.fromEntries(
            Object.entries(userData).filter(([key]) => fields.includes(key))
        );
    }
}

export default User;
