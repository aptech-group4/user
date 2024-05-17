import { IsNotEmpty } from "class-validator";

export class UserLoginDTO {
    @IsNotEmpty()
    UserName: string;

    @IsNotEmpty()
    Pass: string;
}