export const GQL_SHOWS = `{
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
