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
