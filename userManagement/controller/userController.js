import userContainer from "../container.js";

class UserController{
    constructor(userService)
    {
        this.userService = userService;
    }

    async getProfile(req,res)
    {
        try{
            const userID = req.user.id;
            const user = await this.userService.getUser(userID);
            return res.status(200).json({"user information": user});
        }
        catch(error)
        {
            return res.status(400).json({"error": error.message});
        }
    }
     
    async updateProfile(req,res){
        try{
            const userID = req.user.id;
            const userData = req.body;
            const result = await this.userService.updateUser(userID,userData);
            if(result.success !== true)
            {
                throw new Error("Failed to update user information");
            }
            return res.status(200).json({"message": "User updated successfully"});
        }
        catch(error)
        {
            return res.status(400).json({"error": error.message});
        }
    }
}

const userController = new UserController(userContainer.getUserService());
export default userController;