import { User } from "../../../entities/User";

export type UserGetListDto = {
    UserName: string;
    Pass?: string | null;
    UUID: string;
    FullName: string;
    Email?: string | null;
    PhoneNumber?: string | null;
    CreatedBy: number | 1;
    Address?: string | null; 
    DOB?: string | null; 
    ProfileUrl?: string | null; 

    } 
  