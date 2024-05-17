import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber } from "class-validator";

export class UserCreateDTO {

  @IsNotEmpty()
  UserName: string;

  @IsOptional()
  Pass?: string = null;

  @IsNotEmpty()
  UUID: string;

  @IsNotEmpty()
  FullName: string;

  @IsEmail() 
  @IsOptional()
  Email?: string = null;

  @IsOptional()
  PhoneNumber?: string = null;

  @IsNotEmpty()
  CreatedBy: number = 1;

  @IsOptional()
  Address?: string = null;

  @IsOptional()
  DOB?: Date = null;

  @IsOptional()
  ProfileUrl?: string = null;

} 
