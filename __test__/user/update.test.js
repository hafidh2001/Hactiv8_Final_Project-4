import request from "supertest";
import app from "../../app.js";
import db from "../../db/database.js";
import jwt from "jsonwebtoken";
import { jwt_secret } from "../../config.js";
import { hashSync } from "../../helpers/bcrypt.js";

const userToken = jwt.sign({ id: 1, email: "programmer@gmail.com" }, jwt_secret, {
    expiresIn: "24h",
})

const userNotExistsToken = jwt.sign({ id: 100, email: "designer@gmail.com" }, jwt_secret, {
    expiresIn: "24h",
})

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

describe("PUT /users/:userId", () => {
  // SUCCESS

  // ERROR
  test("HTTP status code 401 (credentials not found)", async () => {
    const res = await request(app).put("/users/1");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      status: "error",
      message: "failed to access, credentials not found",
    });
  });

  test("HTTP status code 401 (authorization failed)", async () => {
    const res = await request(app).put("/users/1").set('Authorization', `Bearer ${userNotExistsToken}`);
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ status: "error", message: "authorization failed" });
  });
});
