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
    profile_image_url: "https://social_media.jpg",
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

const socialMediaData_2 = {
    name: "react dev instagram",
    social_media_url: "https://hactiv.org/react_dev-instagram"
}

const socialMediaData_3 = {
    name: "node dev instagram",
    social_media_url: "https://hactiv.org/node_dev-instagram"
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
    test("HTTP status code 201 (create social media success 1)", async () => {
        const res = await request(app).post("/socialmedias/").set('Authorization', `Bearer ${userToken}`).send(socialMediaData);
        expect(res.status).toEqual(201);
        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
        expect(typeof res.body).toEqual("object");
        expect(res.body).toEqual({
          social_media: {
              id: 1,
              name: socialMediaData.name,
              social_media_url: socialMediaData.social_media_url,
              userId: 1,
              updatedAt: expect.any(String),
              createdAt: expect.any(String)
          }
      })
    });

    test("HTTP status code 201 (create social media success 2)", async () => {
      const res = await request(app).post("/socialmedias/").set('Authorization', `Bearer ${userToken}`).send(socialMediaData_2).expect(201);
      expect(res.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
      expect(typeof res.body).toEqual("object");
      expect(res.body).toEqual({
        social_media: {
            id: 2,
            name: socialMediaData_2.name,
            social_media_url: socialMediaData_2.social_media_url,
            userId: 1,
            updatedAt: expect.any(String),
            createdAt: expect.any(String)
        }
      })
    });

    test("HTTP status code 201 (create social media success 3)", async () => {
      const res = await request(app).post("/socialmedias/").set('Authorization', `Bearer ${userToken}`).send(socialMediaData_3).expect(201);
      expect(res.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
      expect(typeof res.body).toEqual("object");
      expect(res.body).toEqual({
        social_media: {
            id: 3,
            name: socialMediaData_3.name,
            social_media_url: socialMediaData_3.social_media_url,
            userId: 1,
            updatedAt: expect.any(String),
            createdAt: expect.any(String)
        }
      })
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
        const social_media = {...socialMediaData}
        social_media.name = ''
        const res = await request(app).post("/socialmedias/").set('Authorization', `Bearer ${userToken}`).send(social_media).expect(400);
        expect(res.body.message).toEqual("Validation notEmpty on name failed");
    });
    
    test("HTTP status code 400 (format social_media_url)", async () => {
        const social_media = {...socialMediaData}
        social_media.social_media_url = ''
        const res = await request(app).post("/socialmedias/").set('Authorization', `Bearer ${userToken}`).send(social_media).expect(400);
        expect(res.body.message).toEqual("Validation isUrl on social_media_url failed");
    });
});
