export const GQL_SHOW_FIELDS = `
query GetShowByImdbFields {
  showByIMDB(imdbId: "tt3230854"){
    id
    imdbId
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
