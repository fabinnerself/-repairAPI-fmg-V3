import { regularExp } from "../../../config";

export class DeleteUserDTO {
  constructor(
    public id: string
  ) {}

  static create(object: { [key: string]: any }): [string?, DeleteUserDTO?] {
    const { id } = object;

    if (
        !id ||
        typeof id !== "string" ||
        !regularExp.uuid.test(id)
      ) {
        return ["Invalid user id format, must be a UUID"]; 
      }
       

    return [
      undefined,
      new DeleteUserDTO( id ),
    ];
  }
}
