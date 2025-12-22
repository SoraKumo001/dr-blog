import { useFindSystemQuery } from "~/generated/graphql";

const context = { additionalTypenames: ["System"] };
export const useSystem = () => {
  return useFindSystemQuery({ context });
};
