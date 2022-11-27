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

const socialMediaData = {
    name: "programmer instagram",
    social_media_url: "https://hactiv.org/programmer-instagram"
}

beforeAll(async () => {
  // delete all row & start id from 0
  await db.query(`DELETE FROM users;`);
  await db.query(`ALTER SEQUENCE users_id_seq RESTART WITH 1;`);
  await db.query(`DELETE FROM social_medias;`);
  await db.query(`ALTER SEQUENCE social_medias_id_seq RESTART WITH 1;`);
  
  // create
  await db.query(`INSERT INTO users (full_name, email, username, password, profile_image_url, age, phone_number, createdat, updatedat) VALUES ('${user.full_name}', '${user.email}', '${user.username}', '${hashSync(user.password)}', '${user.profile_image_url}', ${user.age}, '${user.phone_number}', '${new Date().toISOString()}', '${new Date().toISOString()}');`)
});
  
afterAll(async () => {
  await db.close();
});

describe("POST /socialmedias/", () => {
    // SUCCESS
    test("HTTP status code 201 (create social media success)", async () => {
        const res = await request(app).post("/socialmedias/").set('Authorization', `Bearer ${userToken}`).send(socialMediaData);
        expect(res.status).toEqual(201);
        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
        expect(typeof res.body).toEqual("object");
        expect(socialMediaData).toHaveProperty("name");
        expect(socialMediaData).toHaveProperty("social_media_url");
        expect(typeof socialMediaData.name).toEqual("string");
        expect(typeof socialMediaData.social_media_url).toEqual("string");
      });

    // ERROR
    test("HTTP status code 401 (credentials not found)", async () => {
        const res = await request(app).post("/socialmedias/").send(socialMediaData);
        expect(res.status).toBe(401);
        expect(res.body).toEqual({
            status: "error",
          message: "failed to access, credentials not found",
        });
    });
    
    test("HTTP status code 401 (authorization failed)", async () => {
        const res = await request(app).post("/socialmedias/").set('Authorization', `Bearer ${userNotExistsToken}`).send(socialMediaData).expect(401);
        expect(res.body).toEqual({ status: "error", message: "authorization failed" });
    });
    
    test("HTTP status code 400 (all field required)", async () => {
        const res = await request(app).post("/socialmedias/").set('Authorization', `Bearer ${userToken}`).send({});
        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            status: "error",
            message: "name & social_media_url is required",
          });
    });

    test("HTTP status code 400 (name empty)", async () => {
        const photo = {...socialMediaData}
        photo.name = ''
        const res = await request(app).post("/socialmedias/").set('Authorization', `Bearer ${userToken}`).send(photo).expect(400);
        expect(res.body.message).toEqual("Validation notEmpty on name failed");
    });
    
    test("HTTP status code 400 (format social_media_url)", async () => {
        const photo = {...socialMediaData}
        photo.social_media_url = ''
        const res = await request(app).post("/socialmedias/").set('Authorization', `Bearer ${userToken}`).send(photo).expect(400);
        expect(res.body.message).toEqual("Validation isUrl on social_media_url failed");
    });
});
