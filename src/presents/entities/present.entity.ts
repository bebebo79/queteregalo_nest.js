import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PresentOption } from "./present.option.entity";



@Entity({name:'presents'})

export class Present {

    //ID primary key
    @PrimaryGeneratedColumn('uuid')
    id!:string

    //descripcion
    @Column('text', {unique:true})
    description!: string

    //opciones
    @Column({
        type:'enum',
        enum: PresentOption, 
        default: PresentOption.DESEABLE
    })
    option!: PresentOption
}
