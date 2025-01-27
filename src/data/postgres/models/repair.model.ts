import {
    BaseEntity,   
    Column,
    Entity,    
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";  
  import {User} from "./user.model"; 
  
  export enum RepairStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
  } 
  
  @Entity()
  export class Repair extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ 
        type: 'date',         
        default: () => 'CURRENT_DATE',
        nullable: false,
     })
    date: Date;

    @Column("integer", {
        nullable: false, 
    })
    motorsNumber: number;

    @Column("text", {        
        nullable: false,
    })
    description: string 

    @Column("enum", {
        enum: RepairStatus,
        default: RepairStatus.PENDING,
      })
    status: RepairStatus;

    @ManyToOne(() => User, (user) => user.repairs)
    @JoinColumn({ name: "idUser" })
    user: User;      

  }