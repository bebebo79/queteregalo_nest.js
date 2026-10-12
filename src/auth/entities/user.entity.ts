import { Present } from "src/presents/entities/present.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";





@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id!: string

   
    @Column('text',{unique: true})
    email!: string

    @Column('text',{
        select: false
    })
    password!: string

    @Column('text')
    fullName!: string

    @Column('bool', {
        default: true
    })
    isActive!: boolean

    @Column('text', {
        array: true,
        default:['user']
    }
    )
    roles!: string[]


    //relacionamos el usuario con varios productos
    @OneToMany(
        ()=> Present,
        (present) => present.user
    ) present? :Present


    //antes de inserter pasar a min. el email
    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLowerCase().trim()
    }

    //antes de actualizar pasar a min. el mail
    @BeforeUpdate()
    checkFiledsBeforeUpdate(){
        this.email =  this.email.toLocaleLowerCase().trim()
    }

}
