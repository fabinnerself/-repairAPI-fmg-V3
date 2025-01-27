import { encriptAdapter, envs } from "../../config";
import { JwtAdapter } from "../../config/jwt.adapter";
import { UserStatus , User } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDTO  } from "../../domain";
import { EmailService } from "./email.service";
import { protectAccountOwner } from "../../config/validate-owner";

export class UserService {
  constructor(private readonly emailService: EmailService) {}

  async login(credentials: LoginUserDto) {
    
    const user = await this.findUserByEmail(credentials.email);
    
    const isMatching = encriptAdapter.compare(
      credentials.password,
      user.password
    );
    if (!isMatching) throw CustomError.unAuthorized("Invalid Credentials");
    
    const token = await JwtAdapter.generateToken({ id: user.id }); 
    if (!token) throw CustomError.internalServer("Error while creating JWT");
    
    return {
      token: token,
      user: {
        id: user.id,
        name: user.name,        
        email: user.email,       
      },
    };
  }

  async register(userData: RegisterUserDTO) {
    
    const user = new User();

    user.name = userData.name;    
    user.email = userData.email;
    user.password = userData.password;
    

    try {
      const dbUser = await user.save();

      await this.sendEmailValidationLink(dbUser.email);

      return {
        id: dbUser.id,
        name: dbUser.name,        
        email: dbUser.email,

        
      };
    } catch (error: any) {
      if (error.code === "23505") {
        throw CustomError.badRequest(
          `User with email: ${userData.email} already exist`
        );
      }
      throw CustomError.internalServer("Error while creating user");
    }
  }

  async findUserByEmail(email: string) {
    const user = await User.findOne({
      where: {
        email: email,
        status: UserStatus.ACTIVE,
      },
    });

    if (!user) throw CustomError.notFoud(`User with email: ${email} not found`);

    return user;
  }

  public sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email }, "300s");
    if (!token) throw CustomError.internalServer("Error getting token");

    const link = `http://${envs.WEBSERVICE_URL}/api/user/validate-email/${token}`;
    const html = `
      <h1>Validate your email</h1>
      <p>Click on the following link to validate your email</p>
      <a href="${link}">Validate your email: ${email}</a>
    `;
    const isSent = this.emailService.sendEmail({
      to: email,
      subject: "Validate your account",
      htmlBody: html,
    });
    if (!isSent) throw CustomError.internalServer("Error sending email");

    return true;
  };

  validateEmail = async (token: string) => {
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw CustomError.badRequest("Invalid Token");

    const { email } = payload as { email: string };
    if (!email) throw CustomError.internalServer("Email not in token");

    const user = await User.findOne({ where: { email: email } });
    if (!user) throw CustomError.internalServer("Email not exist");

    user.status = UserStatus.ACTIVE;

    try {
      await user.save();

      return {
        message: "Usuario activado",
      };
    } catch (error) {
      throw CustomError.internalServer("Something went very wrong");
    }
  };

  async getUserProfile(user: User) {
    return {
      id: user.id,
      name: user.name,      
      email: user.email,
      
    };
  }

  async findOneUser(userId: string) {
    const result = await User.createQueryBuilder("user")
      .where("user.id = :id", { id: userId })
      .andWhere("user.status = :userStatus", { userStatus: UserStatus.ACTIVE })
      .getOne();

    if (!result) {
      throw CustomError.notFoud("User not found");
    }
 
    return result;
  }

  async blockAccount(id: string) {

    const user = await this.findOneUser(id);
    
    user.status = UserStatus.INACTIVE;        

    try {
      const dbUser = await user.save();

      return {
        id: dbUser.id,
        name: dbUser.name,        
        email: dbUser.email,        
        role:dbUser.role,
        status:dbUser.status,
        "🚫 User account blocked": true,
      };

    } catch (error: any) {       
      throw CustomError.internalServer("Error while blocking user account ");

    }
  }

  async allUsers() {
    try {
      return await User.find();
    } catch (error) {
      throw CustomError.internalServer("Error getting data from user");
    }

  }


  async updateUserAccountService(id: string,userBod: any, sessionUserId: string) {

    const user = await this.findOneUser(id);

    const isOwner = protectAccountOwner(id, sessionUserId);
    if (!isOwner)
      throw CustomError.unAuthorized("You are not the owner of this user record");    
    
    user.name = userBod.name;    
    user.email = userBod.email;

    try {
      const dbUser = await user.save();

      return {
        id: dbUser.id,
        name: dbUser.name,        
        email: dbUser.email,        
        role:dbUser.role,
        status:dbUser.status,
        "User account updated": true,
      };

    } catch (error: any) {       
      throw CustomError.internalServer("Error while blocking user account ");

    }
  }

  async deleteUserAccountService(id: string , sessionUserId: string) {

    const user = await this.findOneUser(id);

    const isOwner = protectAccountOwner(id, sessionUserId);
    if (!isOwner)
      throw CustomError.unAuthorized("You are not the owner of this user record");    
    
    user.status = UserStatus.DELETED;

    try {
      const dbUser = await user.save();

      return {
        id: dbUser.id,
        name: dbUser.name,        
        email: dbUser.email,        
        role:dbUser.role,
        status:dbUser.status,
        "User account updated": true,
      };

    } catch (error: any) {       
      throw CustomError.internalServer("Error while blocking user account ");

    }
  }  


}
