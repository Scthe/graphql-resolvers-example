export const GQL_SINGLE_SHOW_ONLY_ID = `{
  show(id: 118){
    id
  }
}`;

export const GQL_SHOW_FIELDS = `{
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

export const GQL_SHOW_WITH_CHILDREN = `{
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