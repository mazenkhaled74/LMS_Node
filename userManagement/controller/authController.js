import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import userContainer from '../container.js';

class AuthController{
    constructor(authService)
    {
        this.authService = authService;
    }

    async signUp(req, res)
    {
        try{
            const userData = req.body;
            const result = await this.authService.register(userData);
            if(result.success !== true)
            {
                throw new Error("Failed to create user");
            }
            return res.status(201).json({"message": "User created successfully. A verificaiton mail is sent"});
        }
        catch(error)
        {
            return res.status(400).json({"error": error.message});
        }
    }

    async signIn(req,res)
    {
        try{
            const userData = req.body;
            const result = await this.authService.validateCredentials(userData);
            return res.status(200).json({"token": result.token, "message": "User Signed In Successfully"});
        }
        catch(error)
        {
            return res.status(400).json({"error": error.message});
        }
    }

    async verifyEmail(req, res) {
        try {
            const { token } = req.query;
            if (!token) {
                return res.status(400).json({ error: "Invalid or missing token." });
            }

            const result = await this.authService.checkVerificationToken(token);
            if(result.success === true)
            {
                const messageTemplate = path.join(__dirname, '../../templates', 'successful_verification.html');
                return res.status(200).sendFile(messageTemplate);
            }
        } 
        catch (error) {
            console.error("Email verification error:", error);
            return res.status(400).json({ error: error.message });
        }
    }
}

const authController = new AuthController(userContainer.getAuthService());
export default authController;