import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity({name: 'UserAdvance'})
export class UserAdvance extends BaseEntity{
    @PrimaryColumn()
    UserId: number;

    @Column({
        length: 256,
        nullable: true
    })
    Address: string;

    @Column({
        type: 'date',
        nullable: true ,
    })
    DOB: Date | null

    @Column({
            length: 128,
            nullable: true
    })
    ProfileUrl: string | null

    @Column({
        default: 1
    })
    CreateBy: number

    @Column({
        type: 'datetime',
        default: () =>'CURRENT_TIMESTAMP'
    })
    CreateDate: Date

    @Column({
        default: 1
    })
    UpdateBy: number

    @Column({
        type: 'datetime',
        default: () =>'CURRENT_TIMESTAMP'
    })
    UpdateDate: Date

}