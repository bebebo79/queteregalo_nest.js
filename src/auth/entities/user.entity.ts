import { Present } from "src/presents/entities/present.entity";
import { Profile } from "src/profile/entities/profile.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";





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

    //Relacion de un perfil por usuario
    @OneToOne(
        ()=> Profile,
        (profile)=> profile.user,
   
    )
    profile!: Profile

    //antes de inserter pasar a min. el email
    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLowerCase().trim()
    }

   

}
