import request from "supertest";
import app from "../../app.js";
import db from "../../db/database.js";

const userData = {
  full_name: "programmer",
  email: "programmer@gmail.com",
  username: "programmer",
  password: "12345",
  profile_image_url: "https://photo.jpg",
  age: 21,
  phone_number: "111111111111",
};

const userData_2 = {
  full_name: "react dev",
  email: "react_dev@gmail.com",
  username: "react_dev",
  password: "12345",
  profile_image_url: "https://photo-react.jpg",
  age: 23,
  phone_number: "222222222222",
};

const userData_3 = {
  full_name: "node dev",
  email: "node_dev@gmail.com",
  username: "node_dev",
  password: "12345",
  profile_image_url: "https://photo-node.jpg",
  age: 25,
  phone_number: "333333333333",
};

beforeAll(async () => {
  // delete all row & start id from 0
  await db.query(`DELETE FROM users;`);
  await db.query(`ALTER SEQUENCE users_id_seq RESTART WITH 1;`);
});

afterAll(async () => {
  await db.close();
});

describe("POST /users/register", () => {
  // SUCCESS
  test("HTTP status code 201 (register success 1)", async () => {
    const res = await request(app).post("/users/register").send(userData);
    expect(res.status).toEqual(201);
    expect(res.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(typeof res.body).toEqual("object");
    expect(res.body).toEqual({
      user: {
        full_name: "programmer",
        email: "programmer@gmail.com",
        username: "programmer",
        profile_image_url: "https://photo.jpg",
        age: "21",
        phone_number: "111111111111",
      }
    })
  });

  test("HTTP status code 201 (register success 2)", async () => {
    const res = await request(app).post("/users/register").send(userData_2).expect(201);
    expect(res.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(typeof res.body).toEqual("object");
    expect(res.body).toEqual({
      user: {
        full_name: "react dev",
        email: "react_dev@gmail.com",
        username: "react_dev",
        profile_image_url: "https://photo-react.jpg",
        age: "23",
        phone_number: "222222222222",
      }
    })
  });

  test("HTTP status code 201 (register success 3)", async () => {
    const res = await request(app).post("/users/register").send(userData_3).expect(201);
    expect(res.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(typeof res.body).toEqual("object");
    expect(res.body).toEqual({
      user: {
        full_name: "node dev",
        email: "node_dev@gmail.com",
        username: "node_dev",
        profile_image_url: "https://photo-node.jpg",
        age: "25",
        phone_number: "333333333333",
      }
    })
  });

  // ERROR
  test("HTTP status code 400 (all field required)", async () => {
    const res = await request(app).post("/users/register").send({});
    expect(res.status).toEqual(400);
    expect(res.body).toEqual({
      status: "error",
      message:
        "full_name, email, username, password, profile_image_url, age & phone_number are required",
    });
  });

  test("HTTP status code 400 (full_name empty)", async () => {
    const user = { ...userData };
    user.full_name = "";
    const res = await request(app)
      .post("/users/register")
      .send(user)
      .expect(400);
    expect(res.body.message).toEqual("Validation notEmpty on full_name failed");
  });

  test("HTTP status code 400 (format email)", async () => {
    const user = { ...userData };
    user.email = "";
    const res = await request(app)
      .post("/users/register")
      .send(user)
      .expect(400);
    expect(res.body.message).toEqual(
      "Please enter your email address in format youremail@example.com"
    );
  });

  test("HTTP status code 400 (username empty)", async () => {
    const user = { ...userData };
    user.username = "";
    const res = await request(app)
      .post("/users/register")
      .send(user)
      .expect(400);
    expect(res.body.message).toEqual("Validation notEmpty on username failed");
  });

  test("HTTP status code 400 (password empty)", async () => {
    const user = { ...userData };
    user.password = "";
    const res = await request(app)
      .post("/users/register")
      .send(user)
      .expect(400);
    expect(res.body.message).toEqual("Validation notEmpty on password failed");
  });

  test("HTTP status code 400 (format profile_image_url)", async () => {
    const user = { ...userData };
    user.profile_image_url = "";
    const res = await request(app)
      .post("/users/register")
      .send(user)
      .expect(400);
    expect(res.body.message).toEqual(
      "Validation isUrl on profile_image_url failed"
    );
  });

  test("HTTP status code 400 (age cannot be empty)", async () => {
    const user = { ...userData };
    user.age = 0;
    const res = await request(app)
      .post("/users/register")
      .send(user)
      .expect(400);
    expect(res.body.message).toEqual("Minimum 1 year allowed in age");
  });

  test("HTTP status code 400 (phone_number empty)", async () => {
    const user = { ...userData };
    user.phone_number = "";
    const res = await request(app)
      .post("/users/register")
      .send(user)
      .expect(400);
    expect(res.body.message).toEqual(
      "Validation notEmpty on phone_number failed"
    );
  });

  test("HTTP status code 400 (email must be unique)", async () => {
    const user = { ...userData };
    const res = await request(app)
      .post("/users/register")
      .send(user)
      .expect(400);
    expect(res.body.message).toEqual("email must be unique");
  });

  test("HTTP status code 400 (username must be unique)", async () => {
    const user = { ...userData };
    user.email = "developer@gmail.com";
    const res = await request(app)
      .post("/users/register")
      .send(user)
      .expect(400);
    expect(res.body.message).toEqual("username must be unique");
  });
});
