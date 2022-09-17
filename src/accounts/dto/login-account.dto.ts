import { IsAscii, IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class LoginAccountDto {
    @IsNotEmpty()
    @IsString()
    @Length(3,12)
    @Matches(/[0-9a-zA-Z\_\.]{3,12}/gm)
    readonly login: string;

    @IsNotEmpty()
    @IsString()
    @Length(8,64)
    @IsAscii()
    readonly password: string;
}
