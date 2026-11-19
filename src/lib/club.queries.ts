import { queryOptions } from "@tanstack/react-query";
import { getPublished } from "./club.functions";
export const clubQuery = queryOptions({
  queryKey: ["club", "published"],
  queryFn: () => getPublished(),
  staleTime: 60_000,
});
