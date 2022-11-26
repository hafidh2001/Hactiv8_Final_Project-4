import request from "supertest";
import app from "../../app.js";

describe("GET /users/", () => {
  // SUCCESS
  test("HTTP status code 200 (show success)", async () => {
    const res = await request(app).get("/users/");
    expect(res.status).toEqual(200);
    expect(res.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
  });
});
