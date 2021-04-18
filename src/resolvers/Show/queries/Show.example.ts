export const GQL_SHOW_ONLY_ID = `
query GetShowOnlyId {
  show(id: 118){
    id
  }
}`;

export const GQL_SHOW_FIELDS = `
query GetShowFields {
  show(id: 118){
    id
    name
    type
    language
    genres
    status
    runtime
    premiered
    summary
  }
}`;

export const GQL_SHOW_WITH_CHILDREN = `
query GetShowWithChildren {
  show(id: 118) {
    id
    name
    seasons {
      node {
        id
        idx
        show {
          id
          name
        }
        episodes {
          node {
            id
            name
            season {
              id
              idx
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
      meta {
        totalCount
      }
    }
  }
}
`;

export const GQL_SHOW_CAST = `
query GetShowCast {
  show(id: 118){
    id
    name

    cast {
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
}`;
