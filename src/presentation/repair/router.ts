import { Router } from "express";
import { RepairService } from "../services/repair.service";
import { UserService } from "../services/user.service";
import { RepairController  } from "./controller";
import { EmailService } from "../services/email.service";
import { envs } from "../../config";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { UserRole } from "../../data";

export class RepairRoutes {
  static get routes(): Router {
    const router = Router();    

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL
    );

    const userService = new UserService(emailService)
    const repairService = new RepairService(userService);
    const repairController = new RepairController(repairService);
 
    router.use(AuthMiddleware.protect);
    router.post("/", repairController.createRepair);        
    router.post("/:id", repairController.noIdRepair);

    router.use(AuthMiddleware.restrictTo(UserRole.ADMIN));
    
    router.get("/", repairController.findAllRepairs);
    router.get("/:id", repairController.findOnerepair);
    router.delete("/", repairController.validRepair);
    router.delete("/:id", repairController.deleteRepair);
    router.patch("/", repairController.validRepair);     
    router.patch("/", repairController.validRepair);
    router.patch("/:id", repairController.updateRepair);
    
    return router;
  }
}
