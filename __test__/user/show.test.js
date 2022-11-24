import request from "supertest";
import app from "../../app.js";
import jwt from "jsonwebtoken";
import { jwt_secret } from "../../config.js";

const userToken = jwt.sign({ id: 1, email: "programmer@gmail.com" }, jwt_secret, {
    expiresIn: "24h",
  })
const userNotExistsToken = jwt.sign({ id: 100, email: "designer@gmail.com" }, jwt_secret, {
    expiresIn: "24h",
  })

describe("GET /users/", () => {
  // SUCCESS
  test("HTTP status code 200 (show success)", async () => {
    const res = await request(app).get("/users/").set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toEqual(200);
    expect(res.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
  });

  // ERROR
  test("HTTP status code 401 (credentials not found)", async () => {
    const res = await request(app).get("/users/");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      status: "error",
      message: "failed to access, credentials not found",
    });
  });

  test("HTTP status code 401 (authorization failed)", async () => {
    const res = await request(app).get("/users/").set('Authorization', `Bearer ${userNotExistsToken}`);
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ status: "error", message: "authorization failed" });
  });
});
