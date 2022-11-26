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
    profile_image_url: "https://programmer-photo.jpg",
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

const updateUserData = {
  full_name: 'design',
  email: 'design@gmail.com',
  username: 'design',
  profile_image_url: "https://design-photo.jpg",
  age: 27,
  phone_number: "101010101010"
};

beforeAll(async () => {
  // delete all row & start id from 0
  await db.query(`DELETE FROM users;`);
  await db.query(`ALTER SEQUENCE users_id_seq RESTART WITH 1;`);
  
  // create
  await db.query(`INSERT INTO users (full_name, email, username, password, profile_image_url, age, phone_number, createdat, updatedat) VALUES ('${user1.full_name}', '${user1.email}', '${user1.username}', '${hashSync(user1.password)}', '${user1.profile_image_url}', ${user1.age}, '${user1.phone_number}', '${new Date().toISOString()}', '${new Date().toISOString()}');`)

  await db.query(`INSERT INTO users (full_name, email, username, password, profile_image_url, age, phone_number, createdat, updatedat) VALUES ('${user2.full_name}', '${user2.email}', '${user2.username}', '${hashSync(user2.password)}', '${user2.profile_image_url}', ${user2.age}, '${user2.phone_number}', '${new Date().toISOString()}', '${new Date().toISOString()}');`)
});
    
afterAll(async () => {
  await db.close();
});

describe("PUT /users/:userId", () => {
  // SUCCESS
  test("HTTP status code 200 (update success)", async () => {
    const res = await request(app).put("/users/2").set('Authorization', `Bearer ${user2Token}`).send(updateUserData);
    expect(res.status).toBe(200)
    expect(res.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(typeof res.body).toEqual("object");
    expect(updateUserData).toHaveProperty("full_name");
    expect(updateUserData).toHaveProperty("email");
    expect(updateUserData).toHaveProperty("username");
    expect(updateUserData).toHaveProperty("profile_image_url");
    expect(updateUserData).toHaveProperty("age");
    expect(updateUserData).toHaveProperty("phone_number");
    expect(typeof updateUserData.full_name).toEqual("string");
    expect(typeof updateUserData.email).toEqual("string");
    expect(typeof updateUserData.username).toEqual("string");
    expect(typeof updateUserData.profile_image_url).toEqual("string");
    expect(typeof updateUserData.age).toEqual("number");
    expect(typeof updateUserData.phone_number).toEqual("string");
  });

  // ERROR
  test("HTTP status code 401 (credentials not found)", async () => {
    const res = await request(app).put("/users/1").send(updateUserData);
    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      status: "error",
      message: "failed to access, credentials not found",
    });
  });

  test("HTTP status code 401 (authorization failed)", async () => {
    const res = await request(app).put("/users/1").set('Authorization', `Bearer ${userNotExistsToken}`).send(updateUserData).expect(401);
    expect(res.body).toEqual({ status: "error", message: "authorization failed" });
  });

  test("HTTP status code 401 (authorization does not match id)", async () => {
    const res = await request(app).put("/users/100").set('Authorization', `Bearer ${user1Token}`).send(updateUserData).expect(401);
    expect(res.body).toEqual({ status: "error", message: "authorization failed" });
  });

  test("HTTP status code 400 (user don't make changes to anything)", async () => {
    const res = await request(app).put("/users/1").set('Authorization', `Bearer ${user1Token}`).send({});
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "you don't make changes to anything"
    });
  });

  test("HTTP status code 400 (full_name empty)", async () => {
    const user = { ...updateUserData }
    user.full_name = ''
    const res = await request(app).put("/users/1").set('Authorization', `Bearer ${user1Token}`).send(user).expect(400);
    expect(res.body.message).toEqual("Validation notEmpty on full_name failed");
  });

  test("HTTP status code 400 (format email)", async () => {
    const user = { ...updateUserData }
    user.email = ''
    const res = await request(app).put("/users/1").set('Authorization', `Bearer ${user1Token}`).send(user).expect(400);
    expect(res.body.message).toEqual(
      "Please enter your email address in format youremail@example.com"
    );
  });

  test("HTTP status code 400 (username empty)", async () => {
    const user = { ...updateUserData }
    user.username = ''
    const res = await request(app).put("/users/1").set('Authorization', `Bearer ${user1Token}`).send(user).expect(400);
    expect(res.body.message).toEqual("Validation notEmpty on username failed");
  });

  test("HTTP status code 400 (format profile_image_url)", async () => {
    const user = { ...updateUserData }
    user.profile_image_url = ''
    const res = await request(app).put("/users/1").set('Authorization', `Bearer ${user1Token}`).send(user).expect(400);
    expect(res.body.message).toEqual(
      "Validation isUrl on profile_image_url failed"
    );
  });

  test("HTTP status code 400 (age cannot be empty)", async () => {
    const user = { ...updateUserData }
    user.age = 0
    const res = await request(app).put("/users/1").set('Authorization', `Bearer ${user1Token}`).send(user).expect(400);
    expect(res.body.message).toEqual("Minimum 1 year allowed in age");
  });

  test("HTTP status code 400 (phone_number empty)", async () => {
    const user = { ...updateUserData }
    user.phone_number = ""
    const res = await request(app).put("/users/1").set('Authorization', `Bearer ${user1Token}`).send(user).expect(400);
    expect(res.body.message).toEqual(
      "Validation notEmpty on phone_number failed"
    );
  });

  test("HTTP status code 400 (email must be unique)", async () => {
    const user = { ...updateUserData }
    const res = await request(app).put("/users/1").set('Authorization', `Bearer ${user1Token}`).send(user).expect(400);
    expect(res.body.message).toEqual("email must be unique");
  });

  test("HTTP status code 400 (username must be unique)", async () => {
    const user = { ...updateUserData }
    user.email = "manager@gmail.com"
    const res = await request(app).put("/users/1").set('Authorization', `Bearer ${user1Token}`).send(user).expect(400);
    expect(res.body.message).toEqual("username must be unique");
  });
});
