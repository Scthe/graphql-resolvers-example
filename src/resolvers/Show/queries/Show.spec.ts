import supertest from "supertest";
import nock, { Scope } from "nock";
import merge from "deepmerge";

import app from "../../../index";
import * as gqlExamples from "./Show.example";
import { Show as GqlSchemaShow } from "typingsGql";
import { setupNock } from "utils/forTests";

import ShowMock from "dataSources/tvmaze/mocks/show.mock.json";
import SeasonMock from "dataSources/tvmaze/mocks/season.mock.json";
import EpisodeMock from "dataSources/tvmaze/mocks/episode.mock.json";
import ShowCastMock from "dataSources/tvmaze/mocks/showCast.mock.json";

describe("GraphQL: show()", () => {
  let scope: Scope | null = null;

  setupNock();

  afterEach(() => {
    scope && scope.done(); // verify all planned requests were actually done
  });

  const mockSuccessShowResponse = (item = ShowMock) => {
    // NOTE: this allows for ONE request
    scope = nock("https://api.tvmaze.com").get("/shows/118").reply(200, item);
  };

  const mockSuccessSeasonsResponse = () => {
    const seasonMock = (id: string, number: number) => ({
      ...SeasonMock,
      id,
      number,
    });
    const episodeMock = (id: number, name: string) => ({
      ...EpisodeMock,
      id,
      name,
    });

    scope!
      .get("/shows/118/seasons")
      .reply(200, [seasonMock("123", 1), seasonMock("999", 2)])
      .get("/seasons/123/episodes")
      .reply(200, [
        episodeMock(1231, "season-123-episode-1"),
        episodeMock(1232, "season-123-episode-2"),
      ])
      .get("/seasons/999/episodes")
      .reply(200, [episodeMock(9991, "season-999-episode-1")]);
  };

  const mockSuccessCastResponse = () => {
    const castMock = (
      personId: number,
      personName: string,
      characterId: number,
      characterName: string
    ) =>
      merge(ShowCastMock, {
        person: {
          id: personId,
          name: personName,
        },
        character: {
          id: characterId,
          name: characterName,
        },
      });

    scope!
      .get("/shows/118/cast")
      .reply(200, [
        castMock(1, "Robert Sean Leonard", 120, "Dr. James Wilson"),
        castMock(5, "Lisa Edelstein", 155, "Dr. Lisa Cuddy"),
      ]);
  };

  test("should only fetch what is needed", () => {
    // In this test we check if we overfetch. We query only for id (which we pass in args),
    // so no network request is expected (nock would throw).
    return supertest(app)
      .post("/graphql")
      .send({
        query: gqlExamples.GQL_SHOW_ONLY_ID,
      })
      .then((resp) => {
        const item = resp.body.data.show as GqlSchemaShow;
        expect(item.id).toBe("118");
        expect(item).toMatchSnapshot(); // just for a good measure
      });
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
      .then((resp) => {
        const item = resp.body.data.show as GqlSchemaShow;
        expect(item.id).toBe("" + ShowMock.id);
        expect(item).toMatchSnapshot(); // just for a good measure
      })
      .finally();
  });

  test("should fetch show with all children depdendencies", () => {
    // This is quite extreme test. We will fetch show with all seasons and episodes.
    // In production app this test would be VERY brittle, so be careful.
    // What we want is to invoke as much resolvers as we can (show/season/episode).
    // TBH I'm doing this to showcase that all connections in graph work correctly.
    mockSuccessShowResponse();
    mockSuccessSeasonsResponse();

    return supertest(app)
      .post("/graphql")
      .send({
        query: gqlExamples.GQL_SHOW_WITH_CHILDREN,
      })
      .then((resp) => {
        const item = resp.body.data.show as GqlSchemaShow;
        expect(item.id).toBe("" + ShowMock.id);
        expect(item.seasons.meta.totalCount).toBe(2);
        expect(item.seasons.node).toHaveLength(2);
        // check season 1
        expect(item.seasons.node[0].id).toBe("123");
        expect(item.seasons.node[0].episodes.node).toHaveLength(2);
        expect(item.seasons.node[0].episodes.meta.totalCount).toBe(2);
        expect(item.seasons.node[0].episodes.node[0].id).toBe("1231");
        expect(item.seasons.node[0].episodes.node[1].id).toBe("1232");
        // check season 2
        expect(item.seasons.node[1].id).toBe("999");
        expect(item.seasons.node[1].episodes.node).toHaveLength(1);
        expect(item.seasons.node[1].episodes.meta.totalCount).toBe(1);
        expect(item.seasons.node[1].episodes.node[0].id).toBe("9991");

        // just for a good measure
        expect(item).toMatchSnapshot();
      })
      .finally();
  });

  test("should fetch cast member", () => {
    const expectCorrectShow = (show: GqlSchemaShow) => {
      expect(show.id).toBe("" + ShowMock.id);
      expect(show.name).toBe(ShowMock.name);
    };

    mockSuccessShowResponse();
    mockSuccessCastResponse();

    return supertest(app)
      .post("/graphql")
      .send({
        query: gqlExamples.GQL_SHOW_CAST,
      })
      .then((resp) => {
        const item = resp.body.data.show as GqlSchemaShow;
        expectCorrectShow(item);
        expect(item.cast.meta.totalCount).toBe(2);
        expect(item.cast.node).toHaveLength(2);
        // check cast character 1
        expect(item.cast.node[0].id).toBe("120");
        expect(item.cast.node[0].name).toBe("Dr. James Wilson");
        expectCorrectShow(item.cast.node[0].show);
        expect(item.cast.node[0].person.id).toBe("1");
        expect(item.cast.node[0].person.name).toBe("Robert Sean Leonard");
        // check cast character 2
        expect(item.cast.node[1].id).toBe("155");
        expect(item.cast.node[1].name).toBe("Dr. Lisa Cuddy");
        expectCorrectShow(item.cast.node[1].show);
        expect(item.cast.node[1].person.id).toBe("5");
        expect(item.cast.node[1].person.name).toBe("Lisa Edelstein");

        // just for a good measure
        expect(item).toMatchSnapshot();
      })
      .finally();
  });
});
