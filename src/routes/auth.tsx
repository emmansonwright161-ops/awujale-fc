import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/club/auth";
import { pageHead } from "@/lib/club";
export const Route = createFileRoute("/auth")({
  head: () =>
    pageHead("Staff sign in", "Secure sign in for authorised AWUJALE BOYZ FC club staff."),
  component: AuthPage,
});
