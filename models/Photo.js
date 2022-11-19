import db from "../db/database.js";
import { DataTypes } from "sequelize";

const Photos = db.define(
  "photos",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true,
        max: {
          args: [255],
          msg: "Maximum 255 characters allowed in title",
        },
      },
    },
    caption: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true,
      },
    },
    poster_image_url: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isUrl: true,
        notEmpty: true,
        notNull: true,
      },
    },
    userId: {
      field: "userid",
      type: DataTypes.INTEGER,
      allowNull: false,
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
  }
);

export default Photos;
