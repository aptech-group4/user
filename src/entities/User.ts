import { BaseEntity, Column, Entity, EntityManager, PrimaryGeneratedColumn } from "typeorm"
import { UserAdvance } from "./UserAdvance"
import { AppDataSource } from "../data-source"
import { Errors, Pagination } from "../helpers/error";
import { UserUpdateDto } from "../modules/users/dtos/user-update.dto";
import { UserCreateDTO } from "../modules/users/dtos/user-create.dto";
import { UserDetailDto } from "../modules/users/dtos/user-detail.dto";
import { UserLoginDTO } from "../modules/users/dtos/user-login.dto";


@Entity({ name: 'user' })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    UserId: number

    @Column({
        length: 32,
        nullable: false
    })
    UserName: string

    @Column({
        length: 255,
        default: null
    })
    Pass: string | null

    @Column({
        length: 36,
        nullable: false
    })
    UUID: string

    @Column({
        length: 128,
        nullable: false
    })
    FullName: string

    @Column({
        length: 64,
        default: null
    })
    Email: string | null

    @Column({
        length: 16,
        default: null
    })
    PhoneNumber: string | null

    @Column({
        nullable: false
    })
    CreatedBy: number | 1

    @Column({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP'
    })
    CreateDate: Date

    @Column({
        nullable: false,
        default: 1
    })
    UpdateBy: number | 1

    @Column({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP'
    })
    UpdateDate: Date


    static async createUser(userCreateDto: UserCreateDTO) {
        return await AppDataSource.transaction(async entityManager => {
            const newUser = await entityManager.insert(User, userCreateDto);
            const userId = newUser.raw.insertId;
            await entityManager.insert(UserAdvance, userCreateDto);
            return userId;
        });
    }

    static async getDetail(userId: number): Promise<UserDetailDto> {
        const UserDetail = await User
            .getRepository()
            .createQueryBuilder("user")
            .select([
                "user.UserId as UserId",
                "user.UserName as UserName",
                "user.UUID",
                "user.FullName",
                "user.Email",
                "user.PhoneNumber",
                "user.CreatedBy",
                "userAdvance.Address",
                "userAdvance.DOB",
                "userAdvance.ProfileUrl"
            ])
            .leftJoin(UserAdvance, "userAdvance", "useradvance.UserId = user.UserId")
            .where("user.userId = :userId", { userId })
            .getRawOne()

        return UserDetail;

    }

    static async getListUser(pagination: Pagination) {
        const { limit, getOffset } = pagination
        const [listUsers, total] = await Promise.all([AppDataSource.getRepository(User)
            .createQueryBuilder("user")
            .select([
                "user.UserId as UserId",
                "user.UserName as UserName",
                "user.UUID as UUID",
                "user.FullName as FullName",
                "user.Email as Email",
                "user.PhoneNumber as PhoneNumber",
                "user.CreatedBy as CreatedBy",
                "userAdvance.Address as Address",
                "userAdvance.DOB as DOB",
                "userAdvance.ProfileUrl as ProfileUrl"
            ])
            .leftJoin(UserAdvance, "userAdvance", "useradvance.UserId = user.UserId")
            .limit(limit)
            .offset(getOffset(pagination))
            .getRawMany(),
        AppDataSource.getRepository(User).count()
        ]);
        pagination.total = total;
        return { listUsers, pagination };
    }

    static async updateUser(userUpdateDto: UserUpdateDto) {
        const { UserId, Address, DOB, ProfileUrl } = userUpdateDto
        const entityManager: EntityManager = AppDataSource.getRepository(User).manager;
        return await entityManager.transaction(async transactionalEntityManager => {
            const user = await User.findOne({
                where: {
                    UserId
                }
            });
            if (!user) {
                throw Errors.UserNotFound;
            }
            Object.assign(user, userUpdateDto)
            await transactionalEntityManager.save(user);

            const userAdvance = await UserAdvance.findOne({
                where: {
                    UserId
                }
            })
            if (!userAdvance) {
                throw Errors.UserNotFound;
            }
            const userAdvanceUpdateData = {
                Address: Address,
                DOB: DOB,
                ProfileUrl: ProfileUrl
            }
            Object.assign(userAdvance, userAdvanceUpdateData)
            await transactionalEntityManager.save(userAdvance);
            return user;
        });
    }

    static async deleteUserById(userId: number) {
        const entityManager: EntityManager = AppDataSource.getRepository(User).manager;
        return await entityManager.transaction(async transactionalEntityManager => {
            const user = await User.findOne({
                where: {
                    UserId: userId
                }
            })
            if (!user) {
                throw Errors.UserNotFound;
            }
            const userAdvance = await UserAdvance.findOne({
                where: {
                    UserId: userId
                }
            })
            if (!userAdvance) {
                throw Errors.UserNotFound;
            }
            await transactionalEntityManager.delete(User, userId)
            await transactionalEntityManager.delete(UserAdvance, userId);
        })
    }

    static async getUserLoginId(userLoginData: UserLoginDTO) {

        const userLogin = await User.findOne({
            where: {
                UserName: userLoginData.UserName,
                Pass: userLoginData.Pass
            }
        })
        return userLogin;


    }


}
