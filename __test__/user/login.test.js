import request from "supertest";
import app from "../../app.js";
import jwt from "jsonwebtoken";
import { jwt_secret } from "../../config.js";

const userData = {
    email: "programmer@gmail.com",
    password: "12345",
};

describe("POST /users/login", () => {
    // SUCCESS (7 EXPECT)
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
            full_name: "programmer",
            email: "programmer@gmail.com",
            username: "programmer",
            profile_image_url: "https://photo.jpg",
            age: "21",
            phone_number: "111111111111",
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            iat: expect.any(Number),
            exp: expect.any(Number),
        });
    });

    // ERROR (6 EXPECT)
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
