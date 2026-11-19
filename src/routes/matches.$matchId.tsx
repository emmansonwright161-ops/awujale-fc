import { createFileRoute } from "@tanstack/react-router";
import { DetailPage } from "@/components/club/content";
import { clubQuery } from "@/lib/club.queries";
import { pageHead } from "@/lib/club";
export const Route = createFileRoute("/matches/$matchId")({
  loader: ({ context }) => context.queryClient.ensureQueryData(clubQuery),
  head: ({ loaderData, params }) => {
    const r = loaderData?.find(
      (r) => r.kind === "fixtures" && (r.id === params.matchId || r.slug === params.matchId),
    );
    return pageHead(
      r?.title || "Record unavailable",
      r?.details.excerpt || "Official AWUJALE BOYZ FC fixtures record.",
    );
  },
  component: Detail,
});
function Detail() {
  const params = Route.useParams();
  return <DetailPage kind="fixtures" id={params.matchId} />;
}
