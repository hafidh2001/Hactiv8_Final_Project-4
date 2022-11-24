import request from "supertest";
import app from "../../app.js";
import jwt from "jsonwebtoken";
import { jwt_secret } from "../../config.js";

const user = {
    full_name: "programmer",
    email: "programmer@gmail.com",
    username: "programmer",
    password: "12345",
    profile_image_url: "https://photo.jpg",
    age: 21,
    phone_number: "111111111111",
    createdAt: new Date(),
    updatedAt: new Date()
};

const userToken = jwt.sign({ id: 1, email: user.email }, jwt_secret, {
    expiresIn: "24h",
  })
console.log(userToken, typeof userToken)

describe("GET /users/", () => {
  // SUCCESS
  test("HTTP status code 200 (show success)", async () => {
    const res = await request(app).get("/users/").set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toEqual(200);
    expect(res.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
  });
  
//   test("HTTP status code 200 (show success)", async () => {
//     const res = await request(app).get("/users/");
//     expect(res.status).toEqual(200);
//     expect(res.headers["content-type"]).toEqual(
//       expect.stringContaining("json")
//     );
//   });
});
