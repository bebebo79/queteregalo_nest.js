import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PresentOption } from "./present.option.entity";
import { User } from "src/auth/entities/user.entity";
import { Category } from "src/categories/entities/category.entity";



@Entity({name:'presents'})

export class Present {

    //ID primary key
    @PrimaryGeneratedColumn('uuid')
    id!:string

    //descripcion
    @Column('text')
    description!: string

    //opciones
    @Column({
        type:'enum',
        enum: PresentOption, 
        default: PresentOption.DESEABLE
    })
    option!: PresentOption

    //relacion el producto con una category
   @ManyToOne(
    () => Category,
    (category) => category.presents,
    { eager: true }
        )
    category!: Category
    
    // relacionamos el producto con un usuario
    @ManyToOne(
        ()=> User,
        (user) => user.present,
        {eager: true} //traer los productos
    ) user! : User


}
