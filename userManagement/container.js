import EmailService from '../utils/emailService.js';
import UserRepository from './model/userRepository.js';
import AuthService from './service/authService.js';
import UserService from './service/userService.js';

class UserContainer{
    #authService;
    #userService;

    constructor()
    {
        const emailService = new EmailService();
        const userRepository = new UserRepository();

        this.#authService = new AuthService(userRepository, emailService);
        this.#userService = new UserService(userRepository);
    }

    getAuthService(){
        return this.#authService;
    }

    getUserService(){
        return this.#userService;
    }
}


const userContainer = new UserContainer();
export default userContainer;