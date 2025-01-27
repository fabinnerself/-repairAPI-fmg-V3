import { Code } from "typeorm";
import { Repair , RepairStatus } from "../../data";
import { UserService } from "../services/user.service";
import {  CustomError, CreateRepairDTO    } from "../../domain"; 

export class RepairService {
  constructor(private readonly userService: UserService) {}

  async findAllRepairServ() {
 
    try {
      return await Repair.find({
        where: {           
          status:RepairStatus.PENDING
        },
      });
    } catch (error: any) {
      throw CustomError.internalServer("Error geting data from repairs");
    }
  }

  async findOneRepairServ(id: string){ 

    const repair = await Repair.findOne({
        where: {
          id ,
          status:RepairStatus.PENDING
        },
      });
  
      if (!repair) {
        
        throw CustomError.notFoud("A pending Repair not found");
      }
  
      return repair; 
  }

  async deleteRepairServ (id: string){
 
    const repair = await this.findOneRepairServ(id); 

    repair.status = RepairStatus.CANCELLED;

    try {
      await repair.save();
      return { message:"Repair record  deleted successfully with status cancelled" };
    } catch (error) {
      throw CustomError.internalServer("Error deleting user");
    }    
  }

  async createRepairServ (repairData: CreateRepairDTO){

    const user = await this.userService.findOneUser(repairData.userId);

    const repair = new Repair()

    repair.date = repairData.date;    
    repair.motorsNumber = repairData.motorsNumber;
    repair.description = repairData.description;
    repair.user = user;

    try {
        const repairDB = await repair.save();

        return {
          id: repairDB.id,
          date: repairDB.date,
          motorsNumber: repairDB.motorsNumber,
          description: repairDB.description,
          user: {             
              name: user.name,
              email: user.email,             
              role: user.role,             
          }
        };

      } catch (error:any) {  

        throw CustomError.internalServer("Error creating repair");
      }
  }

  async updateRepairServ (id: string ){
    const repair = await this.findOneRepairServ(id); 
  
    repair.status = RepairStatus.COMPLETED;

    try {
        return await repair.save();
      } catch (error: any) {
       
        throw CustomError.internalServer("Error updating repair");
      }
  }  

  async verifyUserID(id: string){
    const user = await  this.userService.findOneUser(id);
    console.log("res: ",user)

    return user
        
  }
}