import {Table, Column, Model, DataType} from 'sequelize-typescript';

@Table({ tableName: 'bets' })
export class Bet extends Model<Bet> {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id: number;

    @Column({ allowNull: false, type: DataType.INTEGER })
    userID: number;

    @Column({ allowNull: false, type: DataType.INTEGER })
    amount: number;

    @Column({ allowNull: false, type: DataType.FLOAT })
    chance: number;

    @Column({ allowNull: false, type: DataType.INTEGER })
    payout: number;

    @Column({ allowNull: false, type: DataType.BOOLEAN })
    win: boolean;
}