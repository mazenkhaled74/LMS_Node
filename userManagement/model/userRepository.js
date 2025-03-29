import pool from "../../config/db.js";
import User from "./user.js";

class UserRepository {

    constructor(){
        this.pool = pool;
    }

    async create(user, connection) { 
        try {
            const query = `
                INSERT INTO "users" (username, first_name, last_name, email, password, role) 
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;

            const values = [
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPassword(),
                user.getRole()
            ];

            const result = await connection.query(query, values);
            return {success: true, userId: result.rows[0].id};
        }
        catch (error) {
            console.error("Error in create:", error.message);
            throw error;
        } 
    }

    async update(userId, updatedFields) {
        if (!updatedFields || Object.keys(updatedFields).length === 0) {
            throw new Error("No fields provided for update.");
        }
        if (!userId) {
            throw new Error("User ID is required for update.");
        }

        let connection;
        try {
            connection = await this.pool.connect();
            const updates = [];
            const values = [];
            let index = 1;

            for (const [key, value] of Object.entries(updatedFields)) {
                updates.push(`${key} = $${index}`);
                values.push(value);
                index++;
            }

            values.push(userId);

            const query = `UPDATE "users" SET ${updates.join(", ")} WHERE id = $${index}`;
            await connection.query(query, values);

            return { success: true };
        } 
        catch (error) {
            console.error("Error in update:", error.message);
            throw error;
        } 
        finally {
            if (connection) {
                connection.release();
            }
        }
    }

    async delete(userId) {
        let connection;
        try {
            connection = await this.pool.connect();
            await connection.query(`DELETE FROM "users" WHERE id = $1`, [userId]);
            return true;
        } 
        catch (error) {
            console.error("Error in delete:", error.message);
            throw error;
        } 
        finally {
            if (connection) {
                connection.release();
            }
        }
    }

    async getById(userID) {
        let connection;
        try {
            connection = await this.pool.connect();
            const result = await connection.query(`SELECT * FROM "users" WHERE id = $1`, [userID]);

            if (result.rows.length === 0){
                return null;
            }
            return new User(result.rows[0]);
        } 
        catch (error) {
            console.error("Error in getById:", error.message);
            throw error;
        } 
        finally {
            if (connection) {
                connection.release();
            }
        }
    }

    async getByUsername(username) {
        let connection;
        try {
            connection = await this.pool.connect();
            const result = await connection.query('SELECT id, password, role, verified FROM "users" WHERE username = $1', [username]);
            return result.rows[0] || null;
        } 
        catch (error) {
            console.error("Error in getByUsername:", error.message);
            throw error;
        } 
        finally {
            if (connection) {
                connection.release();
            }
        }
    }

    async existsByEmail(email) {
        let connection;
        try {
            connection = await this.pool.connect();
            const result = await connection.query(`SELECT 1 FROM "users" WHERE email = $1`, [email]);
            return result.rowCount > 0;
        } 
        catch (error) {
            console.error("Error in existsByEmail:", error.message);
            throw error;
        } 
        finally {
            if (connection) {
                connection.release();
            }
        }
    }

    async existsByUsername(username) {
        let connection;
        try {
            connection = await this.pool.connect();
            const result = await connection.query(`SELECT 1 FROM "users" WHERE username = $1`, [username]);
            return result.rowCount > 0;
        } 
        catch (error) {
            console.error("Error in existsByUsername:", error.message);
            throw error;
        } 
        finally {
            if (connection) {
                connection.release();
            }
        }
    }

}


export default UserRepository;