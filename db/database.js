import { node_env, database_url } from "../config.js";
import { Sequelize } from "sequelize";

const db =
  node_env === "production"
    ? new Sequelize(database_url, {
        dialect: "postgres",
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false, // <<<<<<< YOU NEED THIS
          },
        },
        typeValidation: true,
      })
    : new Sequelize(database_url, {
        dialect: "postgres",
        typeValidation: true,
      });

export default db;
