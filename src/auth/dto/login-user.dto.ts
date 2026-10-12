import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator"


export class LoginUserDto {

    //todo lo que tenemos que pedir para iniciar sesion
    // hace de validar de los datos que necesitamos
    @IsString()
    @IsEmail()
    email!: string

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password!: string


    
    
}