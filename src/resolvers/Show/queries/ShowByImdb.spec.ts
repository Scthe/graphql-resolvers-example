import supertest from "supertest";
import nock, { Scope } from "nock";
import merge from "deepmerge";

import app from "../../../index";
import * as gqlExamples from "./ShowByImdb.example";
import { Show as GqlSchemaShow } from "typingsGql";
import { setupNock } from "utils/forTests";

import ShowMock from "dataSources/tvmaze/mocks/show.mock.json";

describe("GraphQL: showByImdb()", () => {
  let scope: Scope | null = null;

  setupNock();

  afterEach(() => {
    scope && scope.done(); // verify all planned requests were actually done
  });

  const mockSuccessShowResponse = (imdbId: string) => {
    // NOTE: this allows for ONE request
    scope = nock("https://api.tvmaze.com")
      .get(`/lookup/shows?imdb=${imdbId}`)
      .reply(
        200,
        merge(ShowMock, {
          externals: {
            imdb: imdbId,
          },
        })
      );
  };

  test("should fetch basic item properties", () => {
    const imdbId = "tt3230854";
    mockSuccessShowResponse(imdbId);

    return supertest(app)
      .post("/graphql")
      .send({
        query: gqlExamples.GQL_SHOW_FIELDS,
      })
      .then((resp) => {
        const item = resp.body.data.showByIMDB as GqlSchemaShow;
        expect(item.id).toBe("" + ShowMock.id);
        expect(item.imdbId).toBe(imdbId);
        expect(item).toMatchSnapshot(); // just for a good measure
      })
      .finally();
  });
});
