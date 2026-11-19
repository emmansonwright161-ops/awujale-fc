import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/club/admin";
import { pageHead } from "@/lib/club";
export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    ...pageHead(
      "Club administration",
      "Secure club staff workspace for official AWUJALE BOYZ FC content.",
    ),
    meta: [
      ...pageHead(
        "Club administration",
        "Secure club staff workspace for official AWUJALE BOYZ FC content.",
      ).meta,
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});
