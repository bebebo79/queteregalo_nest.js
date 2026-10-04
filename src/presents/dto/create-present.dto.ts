import { IsEnum, IsString, MinLength } from "class-validator";
import { PresentOption } from "../entities/present.option.entity";

export class CreatePresentDto {

    @IsString()
    @MinLength(1)
    description! : string

    @IsEnum(PresentOption)
    option! : PresentOption




}
