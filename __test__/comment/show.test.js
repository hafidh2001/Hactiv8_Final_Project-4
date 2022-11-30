import request from "supertest";
import app from "../../app.js";
import db from "../../db/database.js";
import jwt from "jsonwebtoken";
import { jwt_secret } from "../../config.js";
import { hashSync } from "../../helpers/bcrypt.js";

const user = {
  full_name: "programmer",
  email: "programmer@gmail.com",
  username: "programmer",
  password: "12345",
  profile_image_url: "https://social_media.jpg",
  age: 21,
  phone_number: "111111111111"
};

const userToken = jwt.sign({ id: 1, email: user.email }, jwt_secret, {
  expiresIn: "24h",
})

const userNotExistsToken = jwt.sign({ id: 100, email: "designer@gmail.com" }, jwt_secret, {
  expiresIn: "24h",
})

const photoData = {
  title: "Buku 1",
  caption: "Buku 1 - cerita pertama seorang anak",
  poster_image_url: "https://anak-pertama.jpg"
}

const commentData = {
  photoId: 1,
  comment: "wahh bagus sekali"
}

beforeAll(async () => {
// delete all row & start id from 0
await db.query(`DELETE FROM users;`);
await db.query(`ALTER SEQUENCE users_id_seq RESTART WITH 1;`);
await db.query(`DELETE FROM photos;`);
await db.query(`ALTER SEQUENCE photos_id_seq RESTART WITH 1;`);
await db.query(`DELETE FROM comments;`);
await db.query(`ALTER SEQUENCE comments_id_seq RESTART WITH 1;`);

// create
await db.query(`INSERT INTO users (full_name, email, username, password, profile_image_url, age, phone_number, createdat, updatedat) VALUES ('${user.full_name}', '${user.email}', '${user.username}', '${hashSync(user.password)}', '${user.profile_image_url}', ${user.age}, '${user.phone_number}', '${new Date().toISOString()}', '${new Date().toISOString()}');`)
await db.query(`INSERT INTO photos (title, caption, poster_image_url, userid, createdat, updatedat) VALUES ('${photoData.title}', '${photoData.caption}', '${photoData.poster_image_url}', 1, '${new Date().toISOString()}', '${new Date().toISOString()}');`)
await db.query(`INSERT INTO comments (userid, photoid, comment, createdat, updatedat) VALUES (1, ${commentData.photoId}, '${commentData.comment}', '${new Date().toISOString()}', '${new Date().toISOString()}');`)
});

afterAll(async () => {
  await db.close();
});

describe("GET /comments/", () => {
    // SUCCESS
    test("HTTP status code 200 (show comment success)", async () => {
        const res = await request(app).get("/comments/").set('Authorization', `Bearer ${userToken}`);
        expect(res.status).toEqual(200);
        expect(res.headers["content-type"]).toEqual(
            expect.stringContaining("json")
          );
        expect(typeof res.body).toEqual("object");
        expect(res.body).toEqual({
          comments: [
              {
                  id: 1,
                  userId: 1,
                  photoId: 1,
                  comment: "wahh bagus sekali",
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                  photo: {
                      id: 1,
                      title: "Buku 1",
                      caption: "Buku 1 - cerita pertama seorang anak",
                      poster_image_url: "https://anak-pertama.jpg"
                  },
                  user: {
                      id: 1,
                      username: "programmer",
                      profile_image_url: "https://social_media.jpg",
                      phone_number: "111111111111"
                  }
              }
          ]
        })
      });

    // ERROR
    test("HTTP status code 401 (credentials not found)", async () => {
        const res = await request(app).get("/comments/");
        expect(res.status).toBe(401);
        expect(res.body).toEqual({
            status: "error",
          message: "failed to access, credentials not found",
        });
    });
    
    test("HTTP status code 401 (authorization failed)", async () => {
        const res = await request(app).get("/comments/").set('Authorization', `Bearer ${userNotExistsToken}`).expect(401);
        expect(res.body).toEqual({ status: "error", message: "authorization failed" });
    });
});
