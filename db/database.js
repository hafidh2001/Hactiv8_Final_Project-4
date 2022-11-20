import { node_env, database_url, database_url_test } from "../config.js";
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
    : node_env === "development"
    ? new Sequelize(database_url, {
        dialect: "postgres",
        typeValidation: true,
      })
    : node_env === "test"
    ? new Sequelize(database_url_test, {
        dialect: "postgres",
        typeValidation: true,
      })
    : null;

export default db;
