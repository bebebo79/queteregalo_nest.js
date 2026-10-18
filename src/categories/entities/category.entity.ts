
import { Present } from "src/presents/entities/present.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


//tabla para la base de datos
@Entity({name: 'categories'})

export class Category {

    //ID primary key
    @PrimaryGeneratedColumn('uuid')
    id!:string

    //nombre de la categoria
    @Column('text', {unique:true})
    name!: string

    // relacion de una categoria por regalo
    @OneToMany(() => Present, (present) => present.category)
    presents!: Present[]

}
