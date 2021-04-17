import ShowsAPI from "./tvmaze/ShowsAPI";
import SeasonsAPI from "./tvmaze/SeasonsAPI";
import EpisodesAPI from "./tvmaze/EpisodesAPI";

const dataSources = () => {
  return {
    showsAPI: new ShowsAPI(),
    seasonsAPI: new SeasonsAPI(),
    episodesAPI: new EpisodesAPI(),
  };
};

export type DataSources = ReturnType<typeof dataSources>;

export default dataSources;
