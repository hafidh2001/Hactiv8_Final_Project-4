import db from "../db/database.js";
import { DataTypes } from "sequelize";

const SocialMedia = db.define(
  "social_medias",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true,
        max: {
          args: [255],
          msg: "Maximum 255 characters allowed in name",
        },
      },
    },
    social_media_url: {
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

export default SocialMedia;
