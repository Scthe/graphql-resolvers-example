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

/*
export const GET_SINGLE_GQL = `{
  show(id: 118){
    id
    name
    seasons{
      meta {
        totalCount
      }
      node{
        id
        idx
        summary
        show {
          name
        }
      }
    }
  }
}`;
*/