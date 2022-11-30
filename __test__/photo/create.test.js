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

const photoData_2 = {
    title: "Buku 2",
    caption: "Buku 2 - cerita kedua seorang anak",
    poster_image_url: "https://anak-kedua.jpg"
}

const photoData_3 = {
    title: "Buku 3",
    caption: "Buku 3 - cerita ketiga seorang anak",
    poster_image_url: "https://anak-ketiga.jpg"
}

beforeAll(async () => {
  // delete all row & start id from 0
  await db.query(`DELETE FROM users;`);
  await db.query(`ALTER SEQUENCE users_id_seq RESTART WITH 1;`);
  await db.query(`DELETE FROM photos;`);
  await db.query(`ALTER SEQUENCE photos_id_seq RESTART WITH 1;`);
  
  // create
  await db.query(`INSERT INTO users (full_name, email, username, password, profile_image_url, age, phone_number, createdat, updatedat) VALUES ('${user.full_name}', '${user.email}', '${user.username}', '${hashSync(user.password)}', '${user.profile_image_url}', ${user.age}, '${user.phone_number}', '${new Date().toISOString()}', '${new Date().toISOString()}');`)
});
  
afterAll(async () => {
  await db.close();
});

describe("POST /photos/", () => {
    // SUCCESS
    test("HTTP status code 201 (create photo success 1)", async () => {
        const res = await request(app).post("/photos/").set('Authorization', `Bearer ${userToken}`).send(photoData);
        expect(res.status).toEqual(201);
        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
        expect(typeof res.body).toEqual("object");
        expect(res.body).toEqual({
            id: 1,
            title: "Buku 1",
            caption: "Buku 1 - cerita pertama seorang anak",
            poster_image_url: "https://anak-pertama.jpg",
            userId: 1
        })
    });

    test("HTTP status code 201 (create photo success 2)", async () => {
        const res = await request(app).post("/photos/").set('Authorization', `Bearer ${userToken}`).send(photoData_2).expect(201);
        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
        expect(typeof res.body).toEqual("object");
        expect(res.body).toEqual({
            id: 2,
            title: "Buku 2",
            caption: "Buku 2 - cerita kedua seorang anak",
            poster_image_url: "https://anak-kedua.jpg",
            userId: 1
        })
    });

    test("HTTP status code 201 (create photo success 3)", async () => {
        const res = await request(app).post("/photos/").set('Authorization', `Bearer ${userToken}`).send(photoData_3).expect(201);
        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
        expect(typeof res.body).toEqual("object");
        expect(res.body).toEqual({
            id: 3,
            title: "Buku 3",
            caption: "Buku 3 - cerita ketiga seorang anak",
            poster_image_url: "https://anak-ketiga.jpg",
            userId: 1
        })
    });

    // ERROR
    test("HTTP status code 401 (credentials not found)", async () => {
        const res = await request(app).post("/photos/").send(photoData);
        expect(res.status).toBe(401);
        expect(res.body).toEqual({
            status: "error",
          message: "failed to access, credentials not found",
        });
    });
    
    test("HTTP status code 401 (authorization failed)", async () => {
        const res = await request(app).post("/photos/").set('Authorization', `Bearer ${userNotExistsToken}`).send(photoData).expect(401);
        expect(res.body).toEqual({ status: "error", message: "authorization failed" });
    });
    
    test("HTTP status code 400 (all field required)", async () => {
        const res = await request(app).post("/photos/").set('Authorization', `Bearer ${userToken}`).send({});
        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            status: "error",
            message: "title, caption & poster_image_url is required",
          });
    });

    test("HTTP status code 400 (title empty)", async () => {
        const photo = {...photoData}
        photo.title = ''
        const res = await request(app).post("/photos/").set('Authorization', `Bearer ${userToken}`).send(photo).expect(400);
        expect(res.body.message).toEqual("Validation notEmpty on title failed");
    });
    
    test("HTTP status code 400 (format profile_image_url)", async () => {
        const photo = {...photoData}
        photo.poster_image_url = ''
        const res = await request(app).post("/photos/").set('Authorization', `Bearer ${userToken}`).send(photo).expect(400);
        expect(res.body.message).toEqual("Validation isUrl on poster_image_url failed");
    });
    
    test("HTTP status code 400 (caption empty)", async () => {
        const photo = {...photoData}
        photo.caption = ''
        const res = await request(app).post("/photos/").set('Authorization', `Bearer ${userToken}`).send(photo).expect(400);
        expect(res.body.message).toEqual("Validation notEmpty on caption failed");
    });
});
