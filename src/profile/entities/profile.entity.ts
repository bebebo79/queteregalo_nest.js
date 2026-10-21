import { User } from "src/auth/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";




@Entity({name: 'profile'})
export class Profile {

    //ID primary key
    @PrimaryGeneratedColumn('uuid')
    id! : string

    //Talla de camiseta
    @Column('text')
    shirtSize!: string

    //Talla de pantalon
    @Column('text')
    pantSize!: string

    //Talla de calzado
    @Column('text')
    shoeSize!: string


    //Relacion con User
    @OneToOne(
        ()=> User,
        (user)=> user.profile,
        {onDelete:'CASCADE'}
          )
    @JoinColumn()      
    user!: User

}
