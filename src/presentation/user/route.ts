import { Router } from "express";
import { UserController } from "./controller";
import { UserService } from "../services/user.service";
import { EmailService } from "../services/email.service";
import { envs } from "../../config";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { UserRole } from "../../data";

export class UserRoutes {
  static get routes(): Router {
    const router = Router();

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL
    );
    const userService = new UserService(emailService);
    const userController = new UserController(userService);

    router.post("/login", userController.login);
    router.post("/register", userController.register);
    router.get("/validate-email/:token", userController.validateAccount);
    router.patch("/", userController.validUser);  
    router.delete("/", userController.validUser);  
    

    router.use(AuthMiddleware.protect);

    router.get("/information/:id", userController.findOneUser);
    router.get("/profile", userController.getProfile);
    router.get("/", userController.getAllUsers);
    
    router.patch("/:id", userController.updateUser);
    router.patch(
      "/block-account/:id",
      AuthMiddleware.restrictTo(UserRole.ADMIN, UserRole.MODERATOR),
      userController.blockAccount
    );

    router.delete("/:id", userController.deleteUser);
    return router;
  }
}
