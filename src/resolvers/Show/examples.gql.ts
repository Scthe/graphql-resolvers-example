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

export const GET_LIST_GQL = `{
  shows(name: "House"){
    meta{
      totalCount
    }
    node{
  		id
  	  name
    }
  }
}`;