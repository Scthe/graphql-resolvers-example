import ShowsAPI from "./tvmaze/ShowsAPI";
import SeasonsAPI from "./tvmaze/SeasonsAPI";
import EpisodesAPI from "./tvmaze/EpisodesAPI";
import PeopleAPI from "./tvmaze/PeopleAPI";
import ShowCharactersAPI from "./tvmaze/ShowCharactersAPI";

const dataSources = () => {
  return {
    showsAPI: new ShowsAPI(),
    seasonsAPI: new SeasonsAPI(),
    episodesAPI: new EpisodesAPI(),
    peopleAPI: new PeopleAPI(),
    showCharactersAPI: new ShowCharactersAPI(),
  };
};

export type DataSources = ReturnType<typeof dataSources>;

export default dataSources;
