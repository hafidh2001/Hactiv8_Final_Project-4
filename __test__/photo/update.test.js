import request from "supertest";
import app from "../../app.js";
import db from "../../db/database.js";
import jwt from "jsonwebtoken";
import { jwt_secret } from "../../config.js";
import { hashSync } from "../../helpers/bcrypt.js";

const user1 = {
    full_name: "programmer",
    email: "programmer@gmail.com",
    username: "programmer",
    password: "12345",
    profile_image_url: "https://photo.jpg",
    age: 21,
    phone_number: "111111111111"
};

const user1Token = jwt.sign({ id: 1, email: user1.email }, jwt_secret, {
    expiresIn: "24h",
})

const user2 = {
    full_name: "ui_ux",
    email: "ui_ux@gmail.com",
    username: "ui_ux",
    password: "12345",
    profile_image_url: "https://ui_ux-photo.jpg",
    age: 25,
    phone_number: "222222222222"
};

const user2Token = jwt.sign({ id: 2, email: user2.email }, jwt_secret, {
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

beforeAll(async () => {
    // delete all row & start id from 0
    await db.query(`DELETE FROM users;`);
    await db.query(`ALTER SEQUENCE users_id_seq RESTART WITH 1;`);
    await db.query(`DELETE FROM photos;`);
    await db.query(`ALTER SEQUENCE photos_id_seq RESTART WITH 1;`);
    
    // create
    await db.query(`INSERT INTO users (full_name, email, username, password, profile_image_url, age, phone_number, createdat, updatedat) VALUES ('${user1.full_name}', '${user1.email}', '${user1.username}', '${hashSync(user1.password)}', '${user1.profile_image_url}', ${user1.age}, '${user1.phone_number}', '${new Date().toISOString()}', '${new Date().toISOString()}');`)
    await db.query(`INSERT INTO users (full_name, email, username, password, profile_image_url, age, phone_number, createdat, updatedat) VALUES ('${user2.full_name}', '${user2.email}', '${user2.username}', '${hashSync(user2.password)}', '${user2.profile_image_url}', ${user2.age}, '${user2.phone_number}', '${new Date().toISOString()}', '${new Date().toISOString()}');`)
    await db.query(`INSERT INTO photos (title, caption, poster_image_url, userid, createdat, updatedat) VALUES ('${photoData.title}', '${photoData.caption}', '${photoData.poster_image_url}', 1, '${new Date().toISOString()}', '${new Date().toISOString()}');`)
  });

afterAll(async () => {
    await db.close();
});

describe("PUT /photos/:photoId", () => {
    // SUCCESS
    test("HTTP status code 200 (update success)", async () => {
      const res = await request(app).put("/photos/1").set('Authorization', `Bearer ${user1Token}`).send(photoData);
      expect(res.status).toBe(200)
      expect(res.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
      expect(typeof res.body).toEqual("object");
        expect(photoData).toHaveProperty("title");
        expect(photoData).toHaveProperty("poster_image_url");
        expect(photoData).toHaveProperty("caption");
        expect(typeof photoData.title).toEqual("string");
        expect(typeof photoData.poster_image_url).toEqual("string");
        expect(typeof photoData.caption).toEqual("string");
    });
  
    // ERROR
    test("HTTP status code 401 (credentials not found)", async () => {
      const res = await request(app).put("/photos/1").send(photoData);
      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        status: "error",
        message: "failed to access, credentials not found",
      });
    });
  
    test("HTTP status code 401 (authorization failed)", async () => {
      const res = await request(app).put("/photos/1").set('Authorization', `Bearer ${userNotExistsToken}`).send(photoData).expect(401);
      expect(res.body).toEqual({ status: "error", message: "authorization failed" });
    });
  
    test("HTTP status code 401 (photo doesn't exist)", async () => {
      const res = await request(app).put("/photos/100").set('Authorization', `Bearer ${user1Token}`).send(photoData);
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ status: "error", message: "photo doesn't exist" });
    });
  
    test("HTTP status code 400 (user don't make changes to anything)", async () => {
        const res = await request(app).put("/photos/1").set('Authorization', `Bearer ${user1Token}`).send({});
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          message: "you don't make changes to anything"
        });
      });

    test("HTTP status code 400 (title empty)", async () => {
        const photo = {...photoData}
        photo.title = ''
        const res = await request(app).put("/photos/1").set('Authorization', `Bearer ${user1Token}`).send(photo).expect(400);
        expect(res.body.message).toEqual("Validation notEmpty on title failed");
    });
    
    test("HTTP status code 400 (format profile_image_url)", async () => {
        const photo = {...photoData}
        photo.poster_image_url = ''
        const res = await request(app).put("/photos/1").set('Authorization', `Bearer ${user1Token}`).send(photo).expect(400);
        expect(res.body.message).toEqual("Validation isUrl on poster_image_url failed");
    });
    
    test("HTTP status code 400 (caption empty)", async () => {
        const photo = {...photoData}
        photo.caption = ''
        const res = await request(app).put("/photos/1").set('Authorization', `Bearer ${user1Token}`).send(photo).expect(400);
        expect(res.body.message).toEqual("Validation notEmpty on caption failed");
    });
  });