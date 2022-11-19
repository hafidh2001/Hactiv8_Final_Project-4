import db from "../db/database.js";
import { DataTypes } from "sequelize";
import { hash } from "../helpers/bcrypt.js";

const Users = db.define(
  "users",
  {
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true,
        max: {
          args: [255],
          msg: "Maximum 255 characters allowed in full_name",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Please enter your email address in format youremail@example.com",
        },
        notEmpty: true,
        notNull: true,
        max: {
          args: [255],
          msg: "Maximum 255 characters allowed in email",
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        notNull: true,
        max: {
          args: [255],
          msg: "Maximum 255 characters allowed in username",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true,
        len: {
          args: [1, 255],
          msg: "Display password must be between 1 and 255 characters in length",
        },
      },
    },
    profile_image_url: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isUrl: true,
        notEmpty: true,
        notNull: true,
      },
    },
    age: {
      type: DataTypes.NUMBER,
      allowNull: false,
      validate: {
        isNumeric: true,
        notEmpty: true,
        notNull: true,
        min: {
          args: [1],
          msg: "Minimum 1 year allowed in age",
        },
        max: {
          args: [150],
          msg: "Maximum 150 year allowed in age",
        },
        len: {
          args: [1, 3],
          msg: "Display age must be between 1 and 3 characters in length",
        },
      },
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true,
        len: {
          args: [1, 13],
          msg: "Display phone_number must be between 1 and 13 characters in length",
        },
      },
    },
    createdAt: {
      field: "createdat",
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      field: "updatedat",
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    hooks: {
      beforeValidate: () => {
        // console.log("beforeValidate");
      },
      afterValidate: async (users) => {
        users.password = await hash(users.password);
      },
      beforeCreate: () => {
        // console.log("beforeCreate");
      },
      afterCreate: () => {
        // console.log("afterCreate");
      },
    },
  }
);

export default Users;
