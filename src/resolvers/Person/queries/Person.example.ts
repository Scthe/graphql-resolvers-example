export const GQL_PERSON_ONLY_ID = `
query GetPersonOnlyId {
  person(id: 25439){
    id
  }
}`;

export const GQL_PERSON_FIELDS = `
query GetShowFields {
  person(id: 25439){
    id
    name
    countryOfBirth
    birthday
    deathday
    gender
  }
}`;

export const GQL_PERSON_WITH_CHILDREN = `
query GetPersonWithChildren {
  person(id: 25439) {
    id
    name
    castCredits {
      node {
        id
        name
        person {
          id
          name
        }
        show {
          id
          name
        }
      }
      meta {
        totalCount
      }
    }
  }
}
`;
