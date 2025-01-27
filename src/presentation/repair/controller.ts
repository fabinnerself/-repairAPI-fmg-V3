import { Request, Response } from "express";
import {  RepairService } from "../services/repair.service";
import {  CustomError, CreateRepairDTO , UpateRepairDTO } from "../../domain";

export class RepairController {
  constructor(private readonly repairService: RepairService) {}

  private handleError = (error: any, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.log(error);
        

    return res.status(500).json({ message: "Something went very wrong! 🧨" });
  };

  findAllRepairs = (req: Request, res: Response) => {
    this.repairService
      .findAllRepairServ()
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((error: unknown) => this.handleError(error, res));
  };

  findOnerepair = (req: Request, res: Response) => {
    const { id } = req.params;

    const [error, upateRepairDTO ] = UpateRepairDTO.create(req.params);
    if (error) return res.status(422).json({ message: error });

    this.repairService
      .findOneRepairServ(id)
      .then((data: any) => {
        res.status(200).json(data);
      })
      .catch((error: unknown) => this.handleError(error, res));
  };



  deleteRepair = (req: Request, res: Response) => {
    const { id } = req.params;

    const [error, upateRepairDTO ] = UpateRepairDTO.create(req.params);
    if (error) return res.status(422).json({ message: error });

    this.repairService
      .deleteRepairServ(id)
      .then((data:any) => {
        return res.status(200).json(data);
      })
      .catch((error: unknown) => this.handleError(error, res));
  };

  createRepair = (req: Request, res: Response) => {
    const [error, createRepairDTO ] = CreateRepairDTO.create(req.body);

    if (error) return res.status(422).json({ message: error }); 

    this.repairService
      .createRepairServ(createRepairDTO!)
      .then((data: any) => {
        return res.status(201).json(data);
      })
      .catch((error: unknown) => this.handleError(error, res));
  };


  updateRepair = (req: Request, res: Response) => {
    const { id } = req.params;     

    const [error, upateRepairDTO ] = UpateRepairDTO.create(req.params);
    if (error) return res.status(422).json({ message: error });

    this.repairService
      .updateRepairServ(id )
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((error: any) => {       
         this.handleError(error, res)
        
    });
  }; 
  
   validRepair = (req: Request, res: Response) => {
    return res.status(400).json({
      error: "Missing ID parameter. Please provide a user ID in the URL.",
      example: "/api/v1/repair/:id"
    });
  };   

  noIdRepair = (req: Request, res: Response) => {
    return res.status(400).json({
      message: "Do not need to provide a repair id parameter when creating a new repair account."
    });    
  };

}
