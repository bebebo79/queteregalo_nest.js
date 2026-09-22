import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


//tabla para la base de datos
@Entity({name: 'categories'})

export class Category {

    //ID primary key
    @PrimaryGeneratedColumn('uuid')
    id?:string

    //nombre de la categoria
    @Column('text', {unique:true})
    name? : string
}
