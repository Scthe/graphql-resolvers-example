import supertest from "supertest";
import nock, { Scope } from "nock";
import merge from "deepmerge";

import app from "../../../index";
import * as gqlExamples from "./Person.example";
import { Person as GqlSchemaPerson } from "typingsGql";
import { setupNock } from "utils/forTests";

import PersonMock from "dataSources/tvmaze/mocks/person.mock.json";
import PersonCastCreditMock from "dataSources/tvmaze/mocks/personCastcredit.mock.json";
import ShowMock from "dataSources/tvmaze/mocks/show.mock.json";

describe("GraphQL: person()", () => {
  let scope: Scope | null = null;

  setupNock();

  afterEach(() => {
    scope && scope.done(); // verify all planned requests were actually done
  });

  const mockSuccessPersonResponse = (item: Partial<typeof PersonMock> = {}) => {
    // NOTE: this allows for ONE request
    scope = nock("https://api.tvmaze.com")
      .get(`/people/${item.id}`)
      .reply(200, {
        ...PersonMock,
        ...item,
      });
  };

  const mockSuccessChildrenResponse = (personId: number) => {
    const personCastCreditMock = (
      showId: number,
      characterId: number,
      characterName: string
    ) =>
      merge(PersonCastCreditMock, {
        _links: {
          show: {
            href: `https://api.tvmaze.com/shows/${showId}`,
          },
        },
        _embedded: {
          character: {
            id: characterId,
            name: characterName,
          },
        },
      });
    const showMock = (id: number, name: string) => ({
      ...ShowMock,
      id,
      name,
    });

    scope!
      .get(`/people/${personId}/castcredits?embed=character`)
      .reply(200, [
        personCastCreditMock(100, 1, "Dr. Gregory House"),
        personCastCreditMock(200, 5, "The Prince Regent"),
      ])
      .get(`/shows/100`)
      .reply(200, showMock(100, "House"))
      .get(`/shows/200`)
      .reply(200, showMock(200, "Blackadder"));
  };

  test("should only fetch what is needed", () => {
    // In this test we check if we overfetch. We query only for id (which we pass in args),
    // so no network request is expected (nock would throw).
    return supertest(app)
      .post("/graphql")
      .send({
        query: gqlExamples.GQL_PERSON_ONLY_ID,
      })
      .then((resp) => {
        const item = resp.body.data.person as GqlSchemaPerson;
        expect(item.id).toBe("" + PersonMock.id);
        expect(item).toMatchSnapshot(); // just for a good measure
      });
  });

  test("should fetch basic item properties", () => {
    // In this test we get all properties of a person (that are not a paginated list).
    // We should be able to deduplicate request and do it only once.
    mockSuccessPersonResponse({ id: 25439 });

    return supertest(app)
      .post("/graphql")
      .send({
        query: gqlExamples.GQL_PERSON_FIELDS,
      })
      .then((resp) => {
        const item = resp.body.data.person as GqlSchemaPerson;
        expect(item.id).toBe("25439");
        expect(item).toMatchSnapshot(); // just for a good measure
      })
      .finally();
  });

  test("should fetch show with all children depdendencies", () => {
    // This is quite extreme test. We will fetch person with all casting data.
    // In production app this test would be VERY brittle, so be careful.
    // What we want is to invoke as much resolvers as we can (person/cast/show).
    // TBH I'm doing this to showcase that all connections in graph work correctly.
    const personId = 25439;
    mockSuccessPersonResponse({ id: personId });
    mockSuccessChildrenResponse(personId);

    return supertest(app)
      .post("/graphql")
      .send({
        query: gqlExamples.GQL_PERSON_WITH_CHILDREN,
      })
      .then((resp) => {
        const item = resp.body.data.person as GqlSchemaPerson;
        expect(item.id).toBe("" + personId);
        expect(item.name).toBe(PersonMock.name);
        expect(item.castCredits.meta.totalCount).toBe(2);
        expect(item.castCredits.node).toHaveLength(2);
        // check cast character 1
        expect(item.castCredits.node[0].id).toBe("1");
        expect(item.castCredits.node[0].name).toBe("Dr. Gregory House");
        expect(item.castCredits.node[0].show.name).toBe("House");
        // check cast character 2
        expect(item.castCredits.node[1].id).toBe("5");
        expect(item.castCredits.node[1].name).toBe("The Prince Regent");
        expect(item.castCredits.node[1].show.name).toBe("Blackadder");

        // just for a good measure
        expect(item).toMatchSnapshot();
      })
      .finally();
  });
});
