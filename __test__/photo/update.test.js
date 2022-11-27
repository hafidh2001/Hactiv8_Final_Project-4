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
    profile_image_url: "https://photo.jpg",
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

const updatePhotoData = {
    title: "Buku Coding",
    caption: "Buku Coding - JavaScript",
    poster_image_url: "https://buku-javascript.jpg"
}

beforeAll(async () => {
    // delete all row & start id from 0
    await db.query(`DELETE FROM users;`);
    await db.query(`ALTER SEQUENCE users_id_seq RESTART WITH 1;`);
    await db.query(`DELETE FROM photos;`);
    await db.query(`ALTER SEQUENCE photos_id_seq RESTART WITH 1;`);
    
    // create
    await db.query(`INSERT INTO users (full_name, email, username, password, profile_image_url, age, phone_number, createdat, updatedat) VALUES ('${user.full_name}', '${user.email}', '${user.username}', '${hashSync(user.password)}', '${user.profile_image_url}', ${user.age}, '${user.phone_number}', '${new Date().toISOString()}', '${new Date().toISOString()}');`)
    await db.query(`INSERT INTO photos (title, caption, poster_image_url, userid, createdat, updatedat) VALUES ('${photoData.title}', '${photoData.caption}', '${photoData.poster_image_url}', 1, '${new Date().toISOString()}', '${new Date().toISOString()}');`)
  });

afterAll(async () => {
    await db.close();
});

describe("PUT /photos/:photoId", () => {
    // SUCCESS
    test("HTTP status code 200 (update success)", async () => {
      const res = await request(app).put("/photos/1").set('Authorization', `Bearer ${userToken}`).send(updatePhotoData);
      expect(res.status).toBe(200)
      expect(res.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
      expect(typeof res.body).toEqual("object");
        expect(updatePhotoData).toHaveProperty("title");
        expect(updatePhotoData).toHaveProperty("poster_image_url");
        expect(updatePhotoData).toHaveProperty("caption");
        expect(typeof updatePhotoData.title).toEqual("string");
        expect(typeof updatePhotoData.poster_image_url).toEqual("string");
        expect(typeof updatePhotoData.caption).toEqual("string");
    });
  
    // ERROR
    test("HTTP status code 401 (credentials not found)", async () => {
      const res = await request(app).put("/photos/1").send(updatePhotoData);
      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        status: "error",
        message: "failed to access, credentials not found",
      });
    });
  
    test("HTTP status code 401 (authorization failed)", async () => {
      const res = await request(app).put("/photos/1").set('Authorization', `Bearer ${userNotExistsToken}`).send(updatePhotoData).expect(401);
      expect(res.body).toEqual({ status: "error", message: "authorization failed" });
    });
  
    test("HTTP status code 401 (photo doesn't exist)", async () => {
      const res = await request(app).put("/photos/100").set('Authorization', `Bearer ${userToken}`).send(updatePhotoData);
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ status: "error", message: "photo doesn't exist" });
    });
  
    test("HTTP status code 200 (user don't make changes to anything)", async () => {
        const res = await request(app).put("/photos/1").set('Authorization', `Bearer ${userToken}`).send({});
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          message: "you don't make changes to anything"
        });
      });

    test("HTTP status code 400 (title empty)", async () => {
        const photo = {...updatePhotoData}
        photo.title = ''
        const res = await request(app).put("/photos/1").set('Authorization', `Bearer ${userToken}`).send(photo).expect(400);
        expect(res.body.message).toEqual("Validation notEmpty on title failed");
    });
    
    test("HTTP status code 400 (format profile_image_url)", async () => {
        const photo = {...updatePhotoData}
        photo.poster_image_url = ''
        const res = await request(app).put("/photos/1").set('Authorization', `Bearer ${userToken}`).send(photo).expect(400);
        expect(res.body.message).toEqual("Validation isUrl on poster_image_url failed");
    });
    
    test("HTTP status code 400 (caption empty)", async () => {
        const photo = {...updatePhotoData}
        photo.caption = ''
        const res = await request(app).put("/photos/1").set('Authorization', `Bearer ${userToken}`).send(photo).expect(400);
        expect(res.body.message).toEqual("Validation notEmpty on caption failed");
    });
  });