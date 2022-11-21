import request from "supertest";
import app from "../app.js";

describe("POST /users/register", () => {
  //   test("should return HTTP status code 201", async () => {
  //     const res = await request(app).post("/users/register").send({
  //       full_name: "dev 1",
  //       email: "dev_1@gmail.com",
  //       username: "dev_1",
  //       password: "12345",
  //       profile_image_url:
  //         "https://mmc.tirto.id/image/otf/700x0/2016/10/25/shutterstock_4997137032copy_ratio-16x9.jpg",
  //       age: 22,
  //       phone_number: "098098908908",
  //     });
  //     // should respond with a 201 status code
  //     expect(res.status).toEqual(201);
  //     // should specify json in the content type header
  //     expect(res.headers["content-type"]).toEqual(
  //       expect.stringContaining("json")
  //     );
  //     // should type body with a json object
  //     expect(typeof res.body).toEqual("object");
  //     // must have object in res.body
  //     expect(res.body).toHaveProperty("full_name");
  //     expect(res.body).toHaveProperty("email");
  //     expect(res.body).toHaveProperty("username");
  //     expect(res.body).toHaveProperty("password");
  //     expect(res.body).toHaveProperty("profile_image_url");
  //     expect(res.body).toHaveProperty("age");
  //     expect(res.body).toHaveProperty("phone_number");
  //     // type of object res.body
  //     expect(typeof res.body.full_name).toEqual("string");
  //     expect(typeof res.body.email).toEqual("string");
  //     expect(typeof res.body.username).toEqual("string");
  //     expect(typeof res.body.password).toEqual("string");
  //     expect(typeof res.body.profile_image_url).toEqual("string");
  //     expect(typeof res.body.age).toEqual("number");
  //     expect(typeof res.body.phone_number).toEqual("string");
  //   });

  test("should return HTTP status code 400 (all field required)", async () => {
    const res = await request(app).post("/users/register").send({});
    expect(res.status).toEqual(400);
  });

  test("should return HTTP status code 400 (format email)", async () => {
    const res = await request(app).post("/users/register").send({
      full_name: "dev 2",
      email: "dev_2",
      username: "dev_2",
      password: "12345",
      profile_image_url:
        "https://mmc.tirto.id/image/otf/700x0/2016/10/25/shutterstock_4997137032copy_ratio-16x9.jpg",
      age: 22,
      phone_number: "098098908908",
    });
    expect(res.status).toEqual(400);
  });
});
