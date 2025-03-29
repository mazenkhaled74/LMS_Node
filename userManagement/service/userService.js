import dotenv from "dotenv";

dotenv.config()

class UserService {
    constructor(userRepository)
    {
        this.userRepository = userRepository;
    }

    async updateUser(userID, userData) {
        try {
            const user = await this.userRepository.getById(userID);
            if (!user) {
                throw new Error("User not found");
            }

            const restrictedFields = ["email", "password", "role"];
            for (const field of restrictedFields) {
                if (userData[field]) {
                    throw new Error(`Updating ${field} is not allowed.`);
                }
            }
            const result = await this.userRepository.update(userID, userData);
            if (result.success !== true) {
                throw new Error("Failed to update user information");
            }
            return { success: true };
        } catch (error) {
            throw error;
        }
    }

    async getUser(userID) {
        try {
            const user = await this.userRepository.getById(userID);
            if (!user) {
                throw new Error("User not found");
            }
            return user.toJSON();
        } catch (error) {
            throw error;
        }
    }
}

export default UserService;