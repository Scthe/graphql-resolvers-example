import GqlContext from "GqlContext";
import { copyFromRestResponse } from "utils";

type RootType = ID;

const getItem = async (id: RootType, context: GqlContext) => {
  return context.dataSources.personAPI.getPerson(id);
};

async function gender(
  root: RootType,
  _: any,
  context: GqlContext
): Promise<string> {
  const item = await getItem(root, context);
  switch (item.gender.toLowerCase()) {
    case "male":
      return "MALE";
    case "female":
      return "FEMALE";
    default:
      return "OTHER";
  }
}

export default {
  id: (root: RootType): ID => root,
  name: copyFromRestResponse(getItem, "name"),
  birthYear: copyFromRestResponse(getItem, "birth_year"),
  gender,
};
