import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'users' })
export class User extends Model<User> {
    // automatically generated id from uuid
    @Column({ primaryKey: true, type: DataType.UUID, defaultValue:  DataType.UUIDV4 })
    id: number;

    @Column({ unique: true, allowNull: false, type: DataType.STRING })
    username: string;

    @Column({ allowNull: false, type: DataType.STRING })
    password: string;

    @Column({ allowNull: false, type: DataType.INTEGER })
    balance: number;
}