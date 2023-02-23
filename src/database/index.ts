import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";

/* Schemas */
import { User } from "./models/user";
import { Bet } from "./models/bet";

dotenv.config();

const sequelize = new Sequelize({
    dialect: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    logging: false,
});

sequelize.addModels([User, Bet]);

export default sequelize;
