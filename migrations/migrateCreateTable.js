import db from "../db/database.js";

await db.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`).then((res) => {
  console.log(res);
});

await db
  .query(
    `CREATE TABLE IF NOT EXISTS users
(
   id                SERIAL PRIMARY KEY,
   full_name         VARCHAR (255) NOT NULL,
   email             VARCHAR (255) UNIQUE NOT NULL,
   username          VARCHAR (255) UNIQUE NOT NULL,
   password          VARCHAR (255) NOT NULL,
   profile_image_url TEXT NOT NULL,
   age               NUMERIC (3) NOT NULL,
   phone_number      VARCHAR (13) NOT NULL,
   createdAt         TIMESTAMP,
   updatedAt         TIMESTAMP
);`
  )
  .then((res) => {
    console.log(res);
  });

await db
  .query(
    `CREATE TABLE IF NOT EXISTS photos
(
   id               SERIAL PRIMARY KEY,
   title            VARCHAR (255) NOT NULL,
   caption          TEXT NOT NULL,
   poster_image_url TEXT NOT NULL,
   userId           INTEGER NOT NULL,
   createdAt        TIMESTAMP,
   updatedAt        TIMESTAMP,
   CONSTRAINT fk_user_photo FOREIGN KEY(userId) REFERENCES users(id) ON DELETE
   CASCADE ON UPDATE RESTRICT
);`
  )
  .then((res) => {
    console.log(res);
  });

await db
  .query(
    `CREATE TABLE IF NOT EXISTS comments
(
   id               SERIAL PRIMARY KEY,
   userId           INTEGER NOT NULL,
   photoId          INTEGER NOT NULL,
   comment          TEXT NOT NULL,
   createdAt        TIMESTAMP,
   updatedAt        TIMESTAMP,
   CONSTRAINT fk_user_comment FOREIGN KEY(userId) REFERENCES users(id) ON DELETE
   CASCADE ON UPDATE RESTRICT,
   CONSTRAINT fk_photo_comment FOREIGN KEY(photoId) REFERENCES photos(id) ON DELETE
   CASCADE ON UPDATE RESTRICT
);`
  )
  .then((res) => {
    console.log(res);
  });

await db
  .query(
    `CREATE TABLE IF NOT EXISTS social_medias
(
   id               SERIAL PRIMARY KEY,
   name             VARCHAR (255) NOT NULL,
   social_media_url TEXT NOT NULL,
   userId           INTEGER NOT NULL,
   createdAt        TIMESTAMP,
   updatedAt        TIMESTAMP,
   CONSTRAINT fk_user_social_media FOREIGN KEY(userId) REFERENCES users(id) ON DELETE
   CASCADE ON UPDATE RESTRICT
);`
  )
  .then((res) => {
    console.log(res);
  });

await db.close();
