export const GET_SINGLE_N_PLUS_1 = `{
  show(id: 118){
    id
  }
}`;

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
