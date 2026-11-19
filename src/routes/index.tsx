import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/club/home";
import { clubQuery } from "@/lib/club.queries";
import { pageHead } from "@/lib/club";
export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(clubQuery),
  head: () => ({
    ...pageHead(
      "Pride of Ijebu-Ode",
      "Discover AWUJALE BOYZ FC, a football team based in Ijebu-Ode, Ogun State, Nigeria. Explore our squad, fixtures, match results, club news and football journey.",
    ),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SportsTeam",
          name: "AWUJALE BOYZ FC",
          sport: "Football",
          location: { "@type": "Place", name: "Ijebu-Ode, Ogun State, Nigeria" },
        }),
      },
    ],
  }),
  component: HomePage,
});
