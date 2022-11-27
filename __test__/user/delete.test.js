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

describe("DELETE /users/:userId", () => {
    // SUCCESS
    test("HTTP status code 200 (delete success)", async () => {
        const res = await request(app).delete("/users/2").set('Authorization', `Bearer ${user2Token}`);
        expect(res.status).toEqual(200);
        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
        expect(typeof res.body).toEqual("object");
        expect(res.body).toEqual({
            "message": "Your account has been successfully deleted"
        });
    });

    // ERROR
    test("HTTP status code 401 (credentials not found)", async () => {
        const res = await request(app).delete("/users/1");
        expect(res.status).toBe(401);
        expect(res.body).toEqual({
          status: "error",
          message: "failed to access, credentials not found",
        });
    });
    
    test("HTTP status code 401 (authorization failed)", async () => {
        const res = await request(app).delete("/users/1").set('Authorization', `Bearer ${userNotExistsToken}`).expect(401);
        expect(res.body).toEqual({ status: "error", message: "authorization failed" });
    });
    
    test("HTTP status code 401 (authorization does not match id)", async () => {
        const res = await request(app).delete("/users/100").set('Authorization', `Bearer ${user1Token}`).expect(401);
        expect(res.body).toEqual({ status: "error", message: "authorization failed" });
    });
});
