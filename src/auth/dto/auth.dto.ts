import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class AuthDto {
    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
