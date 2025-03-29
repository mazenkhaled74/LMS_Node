import crypto from 'crypto';
import dotenv from "dotenv";
import User from '../model/user.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import pool from '../../config/db.js';

dotenv.config();

class AuthService {
    constructor(userRepository, emailService)
    {
        this.emailService = emailService;
        this.userRepository = userRepository;
    }

    async register(userData) {
        const connection = await pool.connect();
        try {            
            const usernameExists = await this.userRepository.existsByUsername(userData.username);
            const emailExists = await this.userRepository.existsByEmail(userData.email);

            if (usernameExists || emailExists) {
                throw new Error("Username or Email already exists");
            }
            connection.query('BEGIN');

            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(userData.password, salt);
            userData.password = hashedPassword;

            const user = new User(userData);
            const { success, userId } = await this.userRepository.create(user, connection);
            if (!success || !userId) {
                throw new Error("Failed to create user");
            }

            const emailResult = await this.sendVerificationToken(userId, user.getEmail(), connection);
            if (!emailResult.success) {
                throw new Error("Failed to send verification email");
            }

            await connection.query("COMMIT");
            return { success: true, message: "User created successfully. Verification email sent." };
        } 
        catch (error) {
            await connection.query("ROLLBACK");
            throw error;
        }
        finally{
            connection.release();
        }
    }

    async validateCredentials(userData) {
        try {
            const user = await this.userRepository.getByUsername(userData.username);
            if (user) {
                if(!user.verified){
                    throw new Error("Email not verified. Please verify your email.");
                }
                const passwordMatch = await bcrypt.compare(userData.password, user.password);
                if (passwordMatch) {
                    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
                    return { token: token };
                }
            }

            throw new Error("Invalid Credentials");
        } 
        catch (error) {
            throw error;
        }
    }

    async sendVerificationToken(userId, userEmail, connection) {
        const token = crypto.randomBytes(32).toString("hex"); // Generates a secure token

        try{
            await connection.query(
                `INSERT INTO verification_tokens (user_id, token) VALUES ($1, $2)`,
                [userId, token]
            );

            // Send verification email
            const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;
            const result = await this.emailService.sendVerificationEmail(userEmail, verificationLink);
            if(!result.success) {
                return { success: false, message: "Failed to send verification email." };
            }
            return { success: true, message: "Verification email sent." };
        }
        catch(error) {
            console.error("Error in sendVerificationToken:", error.message);
            throw error;
        }
    }

    async checkVerificationToken(token) {
        const connection = await pool.connect();
        try {
            const result = await connection.query(
                `SELECT user_id, expires_at FROM verification_tokens WHERE token = $1`,
                [token]
            );

            if (result.rowCount === 0) {
                throw new Error("Invalid or expired token.");
            }

            
            const { user_id: userId, expires_at: expiresAt } = result.rows[0];
            const emailQueryResult = await connection.query("SELECT email FROM users WHERE id = $1", [userId]);
            const userEmail = emailQueryResult.rows[0].email;

            // Check if token is expired
            if (new Date() > new Date(expiresAt)) {
                // Delete expired token
                await connection.query(`DELETE FROM verification_tokens WHERE token = $1`, [token]);

                // Send a new verification email
                await this.sendVerificationToken(userId, userEmail, connection);

                throw new Error("Token expired. A new verification email has been sent.");
            }

            // Mark the user as verified
            await connection.query(`UPDATE users SET verified = TRUE WHERE id = $1`, [userId]);

            // Delete the token from the database
            await connection.query(`DELETE FROM verification_tokens WHERE token = $1`, [token]);

            return { success: true, message: "Email verified successfully." };
        } catch (error) {
            throw new Error(error.message || "Failed to verify email.");
        }
        finally{
            connection.release();
        }
    }
}

export default AuthService;