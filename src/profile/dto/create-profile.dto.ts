import { IsString, MinLength } from "class-validator";

export class CreateProfileDto {

    @IsString()
    @MinLength(1)
    shirtSize!: string

    @IsString()
    @MinLength(1)
    pantSize!: string

    @IsString()
    @MinLength(1)
    shoeSize!: string
}
