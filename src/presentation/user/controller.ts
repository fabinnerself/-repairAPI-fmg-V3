import { Response, Request } from "express";
import { CustomError, LoginUserDto, RegisterUserDTO, UpdateUserDTO , DeleteUserDTO  } from "../../domain";
import { UserService } from "../services/user.service";

export class UserController {
  constructor(private readonly userService: UserService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.log(error);
    return res.status(500).json({ message: "Something went very wrong! 🧨" });
  };

  login = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);

    if (error) return res.status(422).json({ message: error });

    this.userService
      .login(loginUserDto!)
      .then((data) => res.status(200).json(data))
      .catch((error) => this.handleError(error, res));
  };

  register = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDTO.create(req.body);

    if (error) return res.status(422).json({ message: error });

    this.userService
      .register(registerUserDto!)
      .then((data) => res.status(200).json(data))
      .catch((error) => this.handleError(error, res));
  };

  validateAccount = (req: Request, res: Response) => {
    const { token } = req.params;

    this.userService
      .validateEmail(token)
      .then((data) => res.status(200).json(data))
      .catch((error) => this.handleError(error, res));
  };

  getProfile = (req: Request, res: Response) => {
    this.userService
      .getUserProfile(req.body.sessionUser)
      .then((data) => res.status(200).json(data))
      .catch((error) => this.handleError(error, res));
  };

  blockAccount = (req: Request, res: Response) => {
    const { id } = req.params;
    this.userService
      .blockAccount(id)
      .then((data) => res.status(200).json(data))
      .catch((error) => this.handleError(error, res));
  };

  findOneUser = (req: Request, res: Response) => {
    this.userService
      .findOneUser(req.params.id)
      .then((data) => res.status(200).json({
        name:data.name,
        email:data.email,
        role:data.role,
        status:data.status
      }))
      .catch((error) => this.handleError(error, res));
  };

 

  getAllUsers = (req: Request, res: Response) => {
    this.userService
      .allUsers()
      .then((data) => res.status(200).json(data))
      .catch((error) => this.handleError(error, res));
  };  

  updateUser = (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const userBod = { name: name, email: email };
 
    const [error, updateUserDTO] = UpdateUserDTO.create(req.body);

    if (error) return res.status(422).json({ message: error });

    const sessionUserId = req.body.sessionUser.id;


    this.userService
      .updateUserAccountService(req.params.id,userBod,sessionUserId)
      .then((data) => res.status(200).json({
        name:data.name,
        email:data.email,
        role:data.role,
        status:data.status
      }))
      .catch((error) => this.handleError(error, res));
  };

  validUser = (req: Request, res: Response) => {
    return res.status(400).json({
      error: "Missing ID parameter. Please provide a user ID in the URL.",
      example: "/api/v1/users/:id"
    });
  };     



  deleteUser = (req: Request, res: Response) => {
    const { id } = req.params;    
 
    const [error, deleteUserDTO] =  DeleteUserDTO.create( req.params );

    if (error) return res.status(422).json({ message: error });

    const sessionUserId = req.body.sessionUser.id;

    this.userService
      .deleteUserAccountService(req.params.id,sessionUserId)
      .then((data) => res.status(200).json({
        name:data.name,
        email:data.email,        
        status:data.status
      }))
      .catch((error) => this.handleError(error, res));
  };  
}
