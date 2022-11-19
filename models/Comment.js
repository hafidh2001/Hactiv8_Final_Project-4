import db from "../db/database.js";
import { DataTypes } from "sequelize";

const Comments = db.define(
  "comments",
  {
    userId: {
      field: "userid",
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    photoId: {
      field: "photoid",
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true,
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
  }
);

// Comments.belongsTo(Users, {
//   foreignKey: {
//     name: "userId",
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   onDelete: "CASCADE",
//   onUpdate: "RESTRICT",
// });

// Comments.belongsTo(Photos, {
//   foreignKey: {
//     name: "photoId",
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   onDelete: "CASCADE",
//   onUpdate: "RESTRICT",
// });

export default Comments;
