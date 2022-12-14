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

const socialMedia1Data = {
    name: "programmer instagram",
    social_media_url: "https://hactiv.org/programmer-instagram"
  }

const socialMedia2Data = {
    name: "programmer linkedin",
    social_media_url: "https://hactiv.org/programmer-linkedin"
  }

beforeAll(async () => {
    // delete all row & start id from 0
    await db.query(`DELETE FROM users;`);
    await db.query(`ALTER SEQUENCE users_id_seq RESTART WITH 1;`);
    await db.query(`DELETE FROM social_medias;`);
    await db.query(`ALTER SEQUENCE social_medias_id_seq RESTART WITH 1;`);
    
    // create
    await db.query(`INSERT INTO users (full_name, email, username, password, profile_image_url, age, phone_number, createdat, updatedat) VALUES ('${user.full_name}', '${user.email}', '${user.username}', '${hashSync(user.password)}', '${user.profile_image_url}', ${user.age}, '${user.phone_number}', '${new Date().toISOString()}', '${new Date().toISOString()}');`)
    await db.query(`INSERT INTO social_medias (name, social_media_url, userid, createdat, updatedat) VALUES ('${socialMedia1Data.name}', '${socialMedia1Data.social_media_url}', 1, '${new Date().toISOString()}', '${new Date().toISOString()}');`)
    await db.query(`INSERT INTO social_medias (name, social_media_url, userid, createdat, updatedat) VALUES ('${socialMedia2Data.name}', '${socialMedia2Data.social_media_url}', 1, '${new Date().toISOString()}', '${new Date().toISOString()}');`)
  });

afterAll(async () => {
    await db.close();
});

describe("DELETE /socialmedias/:socialMediaId", () => {
    // SUCCESS
    test("HTTP status code 200 (delete success)", async () => {
        const res = await request(app).delete("/socialmedias/2").set('Authorization', `Bearer ${userToken}`);
        expect(res.status).toEqual(200);
        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
        expect(typeof res.body).toEqual("object");
        expect(res.body).toEqual({
            "message": "Your social media has been successfully deleted"
        });
    });

    // ERROR
    test("HTTP status code 401 (credentials not found)", async () => {
        const res = await request(app).delete("/socialmedias/1");
        expect(res.status).toBe(401);
        expect(res.body).toEqual({
          status: "error",
          message: "failed to access, credentials not found",
        });
    });
    
    test("HTTP status code 401 (authorization failed)", async () => {
        const res = await request(app).delete("/socialmedias/1").set('Authorization', `Bearer ${userNotExistsToken}`).expect(401);
        expect(res.body).toEqual({ status: "error", message: "authorization failed" });
    });
    
    test("HTTP status code 400 (social media doesn't exist)", async () => {
        const res = await request(app).delete("/socialmedias/100").set('Authorization', `Bearer ${userToken}`).expect(400);
        expect(res.body).toEqual({ status: "error", message: "social media doesn't exist" });
    });
});