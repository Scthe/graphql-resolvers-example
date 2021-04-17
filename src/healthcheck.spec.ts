import supertest from "supertest";

import app from "./index";
import { setupNock } from "./utils/forTests";

describe("GraphQL: healthcheck", () => {
  setupNock();

  const url = "/.well-known/apollo/server-health";

  test(`should respond to '${url}'`, () => {
    return supertest(app)
      .get(url)
      .expect(200)
      .then((resp) => {
        expect(resp.body).toHaveProperty("status", "pass");
      });
  });
});
