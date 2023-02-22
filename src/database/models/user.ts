import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'users' })
export class User extends Model<User> {
    @Column({ primaryKey: true, type: DataType.INTEGER, autoIncrement: true})
    id: number;

    @Column({ unique: true, allowNull: false, type: DataType.STRING })
    username: string;

    @Column({ allowNull: false, type: DataType.STRING })
    password: string;

    @Column({ allowNull: false, type: DataType.INTEGER })
    balance: number;

    @Column({ allowNull: true, type: DataType.STRING })
    sid: string;

    @Column({ allowNull: true, type: DataType.DATE })
    expires: Date;

}