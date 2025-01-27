export class UpateRepairDTO {
    constructor(  public readonly id:string) {}
  
    static create(object: { [key: string]: any }): [string?, UpateRepairDTO?] {
        const { id} = object;         

        if (!id) return ["Missing repair id ", undefined];
        if (id.length!=36) return ["Invalid Repair ID format.", undefined];        

        return [undefined, new UpateRepairDTO( id   )];
    }
}