import { DataTypes } from "sequelize";
import Users from "./User.js";
import Photos from "./Photo.js";
import SocialMedia from "./SocialMedia.js";
import Comments from "./Comment.js";

// association between model Users and model Photos
Users.hasMany(Photos, {
  foreignKey: {
    field: "userid",
    name: "userId",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
});

Photos.belongsTo(Users, {
  foreignKey: {
    field: "userid",
    name: "userId",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
});

// association between model Users and model SocialMedia
Users.hasMany(SocialMedia, {
  foreignKey: {
    field: "userid",
    name: "userId",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
});

SocialMedia.belongsTo(Users, {
  foreignKey: {
    field: "userid",
    name: "userId",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
});

// association between model Users and model Photos with junction model Comment
Users.hasMany(Comments, {
  foreignKey: {
    field: "userid",
    name: "userId",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
});

Comments.belongsTo(Users, {
  foreignKey: {
    field: "userid",
    name: "userId",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
});

Photos.hasMany(Comments, {
  foreignKey: {
    field: "photoid",
    name: "photoId",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
});

Comments.belongsTo(Photos, {
  foreignKey: {
    field: "photoid",
    name: "photoId",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
});

// Users.belongsToMany(
//   Photos,
//   { through: Comments },
//   {
//     foreignKey: {
//       name: "userId",
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     onDelete: "CASCADE",
//     onUpdate: "RESTRICT",
//   }
// );

// Photos.belongsToMany(
//   Users,
//   { through: Comments },
//   {
//     foreignKey: {
//       name: "userId",
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     onDelete: "CASCADE",
//     onUpdate: "RESTRICT",
//   }
// );

export { Users, Photos, SocialMedia, Comments };
