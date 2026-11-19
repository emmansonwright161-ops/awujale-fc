import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowUpRight, MapPin, Mail, Shield, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServerFn } from "@tanstack/react-start";
import { useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeading } from "./shell";
import { registerSupporter, sendContact } from "@/lib/club.functions";
import { supporterSchema, contactSchema } from "@/lib/club";
import { clubQuery } from "@/lib/club.queries";
export function EngagementPage({ fans = false }: { fans?: boolean }) {
  const { data } = useSuspenseQuery(clubQuery);
  const settings = data.find((r) => r.kind === "settings");
  const submitFan = useServerFn(registerSupporter);
  const submitMessage = useServerFn(sendContact);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setError("");
    const input = Object.fromEntries(f.entries());
    const validated = fans
      ? supporterSchema.safeParse({ ...input, consent: f.get("consent") === "on" })
      : contactSchema.safeParse(input);
    if (!validated.success) {
      setError(validated.error.issues[0]?.message || "Please complete the form.");
      return;
    }
    setBusy(true);
    try {
      if (fans) {
        const d = supporterSchema.parse({ ...input, consent: f.get("consent") === "on" });
        await submitFan({ data: d });
      } else await submitMessage({ data: contactSchema.parse(input) });
      setDone(true);
      toast.success(fans ? "Welcome to the Awujale family" : "Your message has been received");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeading
        eyebrow={fans ? "THE AWUJALE FAMILY" : "GET IN TOUCH"}
        title={fans ? "ONE CLUB. ONE FAMILY." : "LET’S TALK FOOTBALL."}
        description={
          fans
            ? "From Ijebu-Ode to the world. Wherever you are, there’s a place for you in the Awujale family."
            : "Club enquiries, partnerships or a message from a supporter. We’d love to hear from you."
        }
      />
      <div className="club-container page-body content-split">
        <div>
          <div className="eyebrow text-muted-foreground">
            {fans ? "STAND WITH THE BOYZ" : "AWUJALE BOYZ FC"}
          </div>
          <h2 className="mt-5">
            {fans ? (
              <>
                YOUR PASSION.
                <br />
                OUR STRENGTH.
              </>
            ) : (
              <>
                ROOTED IN IJEBU-ODE.
                <br />
                OPEN TO THE WORLD.
              </>
            )}
          </h2>
          <p>
            {fans
              ? "Football is more than ninety minutes. It’s a shared pride, a familiar voice and a community that stands together. Register your support and be part of the journey."
              : "Our home is Ijebu-Ode, Ogun State, Nigeria. Get in touch with the club using the form."}
          </p>
          <div className="mt-8 flex items-center gap-3 text-sm">
            <MapPin className="text-primary" size={20} />
            Ijebu-Ode, Ogun State, Nigeria
          </div>
          {settings?.details.email && (
            <a className="flex gap-3 mt-5 text-sm" href={`mailto:${settings.details.email}`}>
              <Mail size={20} />
              {settings.details.email}
            </a>
          )}
          {settings?.details.phone && (
            <a className="block mt-5 text-sm" href={`tel:${settings.details.phone}`}>
              {settings.details.phone}
            </a>
          )}
          {!fans && (
            <p className="temporary-caption">
              Official contact details and the exact club address are awaiting confirmation.
            </p>
          )}
          {fans && (
            <div className="mt-10 border-t border-border pt-6">
              <h3 className="text-2xl">MATCHDAY TOGETHER</h3>
              <p>
                Official matchday information, supporter activities and fan campaigns will be
                announced here.
              </p>
              <Button asChild variant="outline" className="mt-5">
                <Link to="/fixtures">
                  Check fixtures
                  <ArrowUpRight />
                </Link>
              </Button>
            </div>
          )}
        </div>
        {done ? (
          <div className="success-panel" role="status">
            <CheckCircle2 size={35} />
            <h2>{fans ? "WELCOME TO THE FAMILY." : "MESSAGE RECEIVED."}</h2>
            <p>
              {fans
                ? "Your supporter registration has been securely saved. Thank you for standing with the Boyz."
                : "Your message has been saved for the club team. Thank you for getting in touch."}
            </p>
            <Button variant="outline" className="mt-6" onClick={() => setDone(false)}>
              {fans ? "Register another supporter" : "Send another message"}
            </Button>
          </div>
        ) : (
          <form className="form-panel" onSubmit={submit}>
            <h2>{fans ? "JOIN THE AWUJALE FAMILY" : "SEND THE CLUB A MESSAGE"}</h2>
            <div className="form-row">
              <label className="field">
                <span>Full name</span>
                <input
                  className="form-input"
                  name="name"
                  placeholder="Your full name"
                  required
                  minLength={2}
                  maxLength={120}
                />
              </label>
              <label className="field">
                <span>Email address</span>
                <input
                  className="form-input"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  maxLength={254}
                />
              </label>
            </div>
            {fans ? (
              <>
                <label className="field">
                  <span>Where are you supporting from?</span>
                  <input
                    className="form-input"
                    name="location"
                    placeholder="City, country"
                    maxLength={200}
                  />
                </label>
                <label className="checkbox-row">
                  <input type="checkbox" name="consent" required />
                  <span>
                    I agree to the club storing my details for supporter registration and contacting
                    me about club activities.
                  </span>
                </label>
              </>
            ) : (
              <>
                <label className="field">
                  <span>Subject</span>
                  <input
                    className="form-input"
                    name="subject"
                    placeholder="What would you like to talk about?"
                    required
                    minLength={2}
                    maxLength={200}
                  />
                </label>
                <label className="field">
                  <span>Your message</span>
                  <textarea
                    className="form-input"
                    name="message"
                    placeholder="Write your message to the club…"
                    required
                    minLength={10}
                    maxLength={5000}
                  />
                </label>
              </>
            )}
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
            <Button type="submit" variant="gold" className="w-full h-11" disabled={busy}>
              {busy ? "Saving…" : fans ? "JOIN THE FAMILY" : "SEND MESSAGE"}
              <ArrowUpRight />
            </Button>
            <p className="temporary-caption flex items-center gap-2">
              <Shield size={12} />
              Your information is kept private.
            </p>
          </form>
        )}
      </div>
    </>
  );
}
