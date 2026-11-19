import { createFileRoute } from "@tanstack/react-router";
import { NewsPage } from "@/components/club/content";
import { clubQuery } from "@/lib/club.queries";
import { pageHead } from "@/lib/club";
export const Route = createFileRoute("/news")({
  loader: ({ context }) => context.queryClient.ensureQueryData(clubQuery),
  head: () =>
    pageHead(
      "Club news",
      "Discover Club news and official AWUJALE BOYZ FC records from Ijebu-Ode, Nigeria.",
    ),
  component: NewsPage,
});
