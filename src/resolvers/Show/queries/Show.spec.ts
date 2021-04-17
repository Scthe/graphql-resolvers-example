import supertest from "supertest";
import nock, { Scope } from "nock";
import app from "../../../index";
import * as gqlExamples from "./Show.example";

describe("GraphQL: show()", () => {
  let scope: Scope | null = null;

  beforeEach(() => {
    // each jest test loads modules anew
    nock.disableNetConnect();
    nock.enableNetConnect('127.0.0.1');
  });

  afterEach(() => {
    scope && scope.done();
    nock.cleanAll();
  });

  afterAll(() => {
    nock.restore(); // https://github.com/nock/nock/issues/1817
  });

  const mockSuccessShowResponse = () => {
    scope = nock('https://api.tvmaze.com')
      .get('/shows/118')
      .reply(200, {
        "hello": "wor;d"
      });
  };

  test("should only fetch what is needed", () => {
    // In this test we check if we overfetch. We query only for id (which we pass in args),
    // so no network request is expected (nock would throw).
    return supertest(app)
      .post("/graphql")
      .send({
        query: gqlExamples.GQL_SINGLE_SHOW_ONLY_ID,
      })
      .then(resp => {
        const item = resp.body.data;
        expect(item.show.id).toBe("118");
        expect(item).toMatchSnapshot(); // just for a good measure
      })
  });

  test("should fetch basic item properties", () => {
    // In this test we get all properties of a show (that are not a paginated list).
    // We should be able to deduplicate request and do it only once.
    mockSuccessShowResponse();

    return supertest(app)
      .post("/graphql")
      .send({
        query: gqlExamples.GQL_SHOW_FIELDS,
      })
      .then(resp => {
        console.log(JSON.stringify(resp.body, null, 2))
        // const item = resp.body.data;
        // expect(item.show.id).toBe("118");
        // expect(item).toMatchSnapshot(); // just for a good measure
      })
      .finally();
  });
});
