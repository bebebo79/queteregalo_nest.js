import { IsEnum, IsString, IsUUID, MinLength } from "class-validator";
import { PresentOption } from "../entities/present.option.entity";
import { Category } from "src/categories/entities/category.entity";

export class CreatePresentDto {

    @IsString()
    @MinLength(1)
    description! : string

    @IsEnum(PresentOption)
    option! : PresentOption

    @IsUUID()
    categoryId!: string

   




}
