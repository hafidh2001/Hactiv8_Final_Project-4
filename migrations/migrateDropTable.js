import db from "../db/database.js";

await db.query(`DROP TABLE IF EXISTS users CASCADE;`).then((res) => {
  console.log(res);
});
await db.query(`DROP TABLE IF EXISTS photos CASCADE;`).then((res) => {
  console.log(res);
});
await db.query(`DROP TABLE IF EXISTS comments;`).then((res) => {
  console.log(res);
});
await db.query(`DROP TABLE IF EXISTS social_medias;`).then((res) => {
  console.log(res);
});

await db.close();
