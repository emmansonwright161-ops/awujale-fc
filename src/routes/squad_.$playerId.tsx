import { createFileRoute } from "@tanstack/react-router";
import { DetailPage } from "@/components/club/content";
import { clubQuery } from "@/lib/club.queries";
import { pageHead } from "@/lib/club";
export const Route = createFileRoute("/squad_/$playerId")({
  loader: ({ context }) => context.queryClient.ensureQueryData(clubQuery),
  head: ({ loaderData, params }) => {
    const r = loaderData?.find(
      (r) => r.kind === "players" && (r.id === params.playerId || r.slug === params.playerId),
    );
    return pageHead(
      r?.title || "Record unavailable",
      r?.details.excerpt || "Official AWUJALE BOYZ FC players record.",
    );
  },
  component: Detail,
});
function Detail() {
  const params = Route.useParams();
  return <DetailPage kind="players" id={params.playerId} />;
}
