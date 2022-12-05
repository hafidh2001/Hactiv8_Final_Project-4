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

const userData = {
    email: user.email,
    password: user.password,
};

beforeAll(async () => {
  // delete all row & start id from 0
  await db.query(`DELETE FROM users;`);
  await db.query(`ALTER SEQUENCE users_id_seq RESTART WITH 1;`);
  
  // create
  await db.query(`INSERT INTO users (full_name, email, username, password, profile_image_url, age, phone_number, createdat, updatedat) VALUES ('${user.full_name}', '${user.email}', '${user.username}', '${hashSync(user.password)}', '${user.profile_image_url}', ${user.age}, '${user.phone_number}', '${new Date().toISOString()}', '${new Date().toISOString()}');`)
});
  
afterAll(async () => {
  await db.close();
});

describe("POST /users/login", () => {
    // SUCCESS
    test("HTTP status code 200 (login success)", async () => {
        const res = await request(app).post("/users/login").send(userData);
        expect(res.status).toEqual(200);
        expect(res.headers["content-type"]).toEqual(
            expect.stringContaining("json")
        );
        expect(typeof res.body).toEqual("object");
        expect(userData).toHaveProperty("email");
        expect(userData).toHaveProperty("password");
        expect(res.body).toEqual({ token: expect.any(String) });
        const claim = jwt.verify(res.body.token, jwt_secret);
        expect(claim).toEqual({
            id: 1,
            full_name: user.full_name,
            email: user.email,
            username: user.username,
            profile_image_url: user.profile_image_url,
            age: user.age.toString(),
            phone_number: user.phone_number,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            iat: expect.any(Number),
            exp: expect.any(Number),
        });
    });

    // ERROR
    test("HTTP status code 400 (all field required)", async () => {
        const res = await request(app).post("/users/login").send({});
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
            status: "error",
            message: "email & password are required",
        });
    });

    test("HTTP status code 400 (only email)", async () => {
        const user = { ...userData };
        delete user.password;
        const res = await request(app).post("/users/login").send(user).expect(400);
        expect(res.body.message).toEqual("email & password are required");
    });

    test("HTTP status code 400 (only password)", async () => {
        const user = { ...userData };
        delete user.email;
        const res = await request(app).post("/users/login").send(user).expect(400);
        expect(res.body.message).toEqual("email & password are required");
    });

    test("HTTP status code 400 (email does not exist)", async () => {
        const user = { ...userData };
        user.email = "developer@gmail.com";
        const res = await request(app).post("/users/login").send(user).expect(400);
        expect(res.body.message).toEqual("email does not exist");
    });

    test("HTTP status code 400 (password does not match)", async () => {
        const user = { ...userData };
        user.password = "dev_123";
        const res = await request(app).post("/users/login").send(user).expect(400);
        expect(res.body.message).toEqual("password does not match");
    });
});
