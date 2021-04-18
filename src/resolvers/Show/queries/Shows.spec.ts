import supertest from "supertest";
import nock, { Scope } from "nock";

import app from "../../../index";
import * as gqlExamples from "./Shows.example";
import { ShowsList as GqlSchemaShowsList } from "typingsGql";
import { setupNock } from "utils/forTests";
import { parseId } from "utils";

import ShowMock from "dataSources/tvmaze/mocks/show.mock.json";
import { ShowSearchItem } from "dataSources/tvmaze/ShowsAPI";

describe("GraphQL: shows()", () => {
  let scope: Scope | null = null;

  setupNock();

  afterEach(() => {
    scope && scope.done(); // verify all planned requests were actually done
  });

  const mockSuccessShowsResponse = () => {
    // NOTE: this allows for ONE request
    const createOneResult = (score: number, id: number): ShowSearchItem => ({
      score,
      show: {
        ...ShowMock,
        id: parseId(id),
        name: `show-${id}`,
      },
    });
    scope = nock("https://api.tvmaze.com/")
      .get("/search/shows?q=House")
      .reply(200, [createOneResult(1, 1), createOneResult(5, 999)]);
  };

  test("should fetch shows list", () => {
    mockSuccessShowsResponse();

    return supertest(app)
      .post("/graphql")
      .send({
        query: gqlExamples.GQL_SHOWS,
      })
      .then((resp) => {
        const result = resp.body.data.shows as GqlSchemaShowsList;
        expect(result.meta.totalCount).toBe(2);
        expect(result.node[0].id).toBe("1");
        expect(result.node[1].id).toBe("999");
        expect(result).toMatchSnapshot(); // just for a good measure
      });
  });
});
