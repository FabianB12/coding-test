/* External dependencies */
import { Transaction } from "sequelize";

/* Local dependencies */
import sequelize from "../database";

/* Schemas */
import { User } from "../database/models/user";

export default async function updateBalance(
    userId: number,
    amountToAdd: number
): Promise<User> {
    const t: Transaction = await sequelize.transaction();

    try {
        const user: User = await User.findByPk(userId, { transaction: t });

        if (!user) {
            throw new Error(`User with id ${userId} not found`);
        }

        const newBalance = user.balance + amountToAdd;

        await user.update({ balance: newBalance }, { transaction: t });

        await t.commit();

        return user;
    } catch (err) {
        await t.rollback();
        throw err;
    }
}
