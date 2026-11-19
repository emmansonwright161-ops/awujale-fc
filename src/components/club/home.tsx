import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  ArrowDown,
  MapPin,
  Shield,
  Heart,
  Crown,
  ArrowRight,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { clubQuery } from "@/lib/club.queries";
import matchday from "@/assets/club-matchday.asset.json";
import training from "@/assets/club-training.asset.json";
import { clubResults, clubGoals } from "@/lib/club";
import { Crest } from "./shell";
import { Empty, MatchCard, RecordCard, SectionHeading } from "./content";
export function HomePage() {
  const { data } = useSuspenseQuery(clubQuery);
  const reduced = useReducedMotion();
  const upcoming = data
    .filter((r) => r.kind === "fixtures" && r.details.status === "Upcoming")
    .sort((a, b) => Date.parse(a.details.kickoff || "") - Date.parse(b.details.kickoff || ""));
  const results = clubResults(data).sort(
    (a, b) => Date.parse(b.details.kickoff || "") - Date.parse(a.details.kickoff || ""),
  );
  const news = data
    .filter((r) => r.kind === "news")
    .sort((a, b) => Number(Boolean(b.details.featured)) - Number(Boolean(a.details.featured)))
    .slice(0, 3);
  const players = data.filter((r) => r.kind === "players").slice(0, 4);
  const sponsors = data.filter((r) => r.kind === "sponsors");
  const gallery = data.filter((r) => r.kind === "gallery" && r.details.image).slice(0, 3);
  return (
    <>
      <section className="hero-section">
        <img
          className="hero-image"
          src={matchday.url}
          alt="Temporary AI-generated image of Nigerian footballers in navy and gold on a stadium pitch"
          fetchPriority="high"
        />
        <div className="hero-overlay" />
        <div className="club-container hero-content">
          <div className="hero-crest">
            <Crest large />
          </div>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <div className="eyebrow text-primary">AWUJALE BOYZ FC · PRIDE OF IJEBU-ODE</div>
            <h1 className="hero-title">
              MORE THAN
              <br />A TEAM.
              <br />
              <span>A LEGACY.</span>
            </h1>
            <p className="hero-summary">
              Pride of Ijebu-Ode. United by Passion.
              <br />
              Driven by Victory.
            </p>
            <div className="hero-buttons">
              <Button asChild variant="gold">
                <Link to="/about">
                  EXPLORE THE CLUB <ArrowUpRight />
                </Link>
              </Button>
              <Button asChild variant="stadium">
                <Link to="/squad">
                  MEET THE SQUAD <ArrowUpRight />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
        <div className="club-container hero-bottom">
          <span className="hero-location flex items-center gap-2">
            <MapPin size={13} />
            IJEBU-ODE, OGUN STATE, NIGERIA
          </span>
          <span className="image-label">
            TEMPORARY AI-GENERATED IMAGERY · NOT ACTUAL CLUB PLAYERS
          </span>
          <div className="hero-pagination" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        </div>
      </section>
      <div className="identity-strip">
        <div className="club-container">
          <span>
            <Crown />
            ROOTED IN HERITAGE
          </span>
          <span>
            <Shield />
            UNITED BY FOOTBALL
          </span>
          <span>
            <Heart />
            DRIVEN BY PASSION
          </span>
          <span>
            <Trophy />
            BUILT FOR THE JOURNEY
          </span>
        </div>
      </div>
      <section className="section">
        <div className="club-container">
          <SectionHeading
            kicker="ON THE PITCH"
            title="THE NEXT CHAPTER"
            to="/fixtures"
            label="Match centre"
          />
          <div className="match-grid">
            <MatchCard record={upcoming[0]} next />
            <div className="match-card">
              <div className="match-card-header">
                <span>LATEST RESULT</span>
                <span className="status-tag">{results[0] ? "FULL TIME" : "OFFICIAL RECORDS"}</span>
              </div>
              {results[0] ? (
                <>
                  <div className="match-awaiting">
                    {results[0].details.homeScore} – {results[0].details.awayScore}
                  </div>
                  <p className="match-note">
                    {results[0].details.homeTeam} vs {results[0].details.awayTeam}
                  </p>
                  <Link
                    to="/matches/$matchId"
                    params={{ matchId: results[0].id }}
                    className="section-link justify-center mb-6"
                  >
                    Match report
                    <ArrowUpRight />
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex justify-center mt-7 text-primary">
                    <Shield size={37} />
                  </div>
                  <h3 className="match-awaiting">READY FOR THE WHISTLE.</h3>
                  <p className="match-note">
                    Our next result starts with the next match.
                    <br />
                    Verified match results will appear here.
                  </p>
                </>
              )}
              <div className="match-meta">
                <Link to="/standings" className="flex items-center gap-2">
                  View league standings <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section pt-0">
        <div className="club-container">
          <SectionHeading
            kicker="BEYOND THE FINAL WHISTLE"
            title="INSIDE AWUJALE BOYZ"
            to="/news"
            label="All club news"
          />
          {news.length ? (
            <div className="record-grid">
              {news.map((r) => (
                <RecordCard key={r.id} record={r} />
              ))}
            </div>
          ) : (
            <div className="news-layout">
              <Link to="/about" className="editorial-card">
                <div className="editorial-image">
                  <img
                    src={training.url}
                    alt="Temporary AI-generated football training scene"
                    loading="lazy"
                  />
                  <span className="image-label">TEMPORARY · AI-GENERATED</span>
                </div>
                <div className="editorial-body">
                  <span className="status-tag">THE CLUB</span>
                  <h3>OUR CITY. OUR COLOURS. OUR STORY.</h3>
                  <p>Discover the identity behind the badge and the community we represent.</p>
                  <div className="editorial-footer">
                    <span>GET TO KNOW AWUJALE BOYZ FC</span>
                    <ArrowUpRight size={17} />
                  </div>
                </div>
              </Link>
              <Link to="/fans" className="editorial-card">
                <div className="club-wordmark">
                  ONE CLUB.
                  <br />
                  <span>ONE FAMILY.</span>
                  <Heart />
                </div>
                <div className="editorial-body">
                  <span className="status-tag">FAN ZONE</span>
                  <h3>
                    YOUR CLUB.
                    <br />
                    YOUR COMMUNITY.
                  </h3>
                  <p>Stand with the Boyz. Become part of the next chapter.</p>
                  <div className="editorial-footer">
                    <span>JOIN THE FANS</span>
                    <ArrowUpRight size={17} />
                  </div>
                </div>
              </Link>
              <Link to="/gallery" className="editorial-card">
                <div className="editorial-image">
                  <img
                    src={matchday.url}
                    alt="Temporary AI-generated football matchday scene"
                    loading="lazy"
                  />
                  <span className="image-label">TEMPORARY · AI-GENERATED</span>
                </div>
                <div className="editorial-body">
                  <span className="status-tag">CLUB MEDIA</span>
                  <h3>
                    THE BEAUTIFUL GAME.
                    <br />
                    THROUGH OUR LENS.
                  </h3>
                  <p>A home for matchday moments, training and life on the pitch.</p>
                  <div className="editorial-footer">
                    <span>EXPLORE THE GALLERY</span>
                    <ArrowUpRight size={17} />
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </section>
      <section className="section dark-band">
        <div className="club-container">
          {players.length ? (
            <>
              <SectionHeading
                kicker="ONE BADGE. ONE AMBITION."
                title="MEET THE FIRST TEAM"
                to="/squad"
                label="Full squad"
              />
              <div className="record-grid">
                {players.map((r) => (
                  <RecordCard record={r} key={r.id} />
                ))}
              </div>
            </>
          ) : (
            <div className="squad-banner">
              <div>
                <div className="eyebrow text-primary">ONE BADGE. ONE AMBITION.</div>
                <h2 className="mt-5">
                  THE BOYZ.
                  <br />
                  <span className="text-primary">OUR PRIDE.</span>
                </h2>
                <p>
                  The passion behind every pass. The commitment behind every performance. Our
                  official first-team squad will be announced here.
                </p>
                <Button asChild variant="gold">
                  <Link to="/squad">
                    EXPLORE THE FIRST TEAM <ArrowUpRight />
                  </Link>
                </Button>
              </div>
              <div>
                <img
                  src={training.url}
                  alt="Temporary AI-generated footballers training, not actual club members"
                  loading="lazy"
                />
                <p className="image-label inline-block mt-2">
                  TEMPORARY IMAGERY · OFFICIAL PLAYER PHOTOS PENDING
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
      <section className="section">
        <div className="club-container">
          <SectionHeading kicker="THE JOURNEY IN NUMBERS" title="CLUB SNAPSHOT" to="/honours" />
          <div className="stats-grid">
            {[
              ["MATCHES PLAYED", results.length || "—"],
              ["GOALS SCORED", results.length ? clubGoals(data) : "—"],
              ["FIRST-TEAM PLAYERS", data.filter((r) => r.kind === "players").length || "—"],
              ["VERIFIED HONOURS", data.filter((r) => r.kind === "honours").length || "—"],
            ].map(([label, value]) => (
              <div className="stat" key={label}>
                <strong>{value}</strong>
                <p>{label}</p>
              </div>
            ))}
          </div>
          <p className="temporary-caption">
            Only confirmed club records are shown. A dash means official data is pending.
          </p>
        </div>
      </section>
      <section className="section pt-0">
        <div className="club-container">
          <SectionHeading
            kicker="THE NEXT KICK-OFF"
            title="UPCOMING FIXTURES"
            to="/fixtures"
            label="Full schedule"
          />
          {upcoming.length ? (
            <div className="record-grid">
              {upcoming.slice(0, 3).map((r) => (
                <MatchCard record={r} next key={r.id} />
              ))}
            </div>
          ) : (
            <Empty
              title="Next fixtures to be announced"
              description="Confirmed opponents, kick-off times and venues will appear here."
            />
          )}
        </div>
      </section>
      <section className="section pt-0">
        <div className="club-container">
          <SectionHeading
            kicker="THE MOMENTS THAT MATTER"
            title="FROM THE TOUCHLINE"
            to="/gallery"
            label="Explore gallery"
          />
          <div className="record-grid">
            {gallery.length
              ? gallery.map((r) => (
                  <Link to="/gallery" className="gallery-preview" key={r.id}>
                    <img src={r.details.image} alt={r.title} loading="lazy" />
                    <span>
                      {r.title}
                      <ArrowUpRight size={16} />
                    </span>
                  </Link>
                ))
              : [training, matchday].map((asset, i) => (
                  <Link to="/gallery" className="gallery-preview" key={asset.url}>
                    <img
                      src={asset.url}
                      alt="Temporary AI-generated football imagery, not actual club members"
                      loading="lazy"
                    />
                    <span>
                      {i ? "MATCHDAY INSPIRATION" : "TRAINING INSPIRATION"}
                      <ArrowUpRight size={16} />
                    </span>
                    <p className="temporary-caption">
                      Temporary AI-generated imagery · Official photographs pending
                    </p>
                  </Link>
                ))}
          </div>
        </div>
      </section>
      <section className="section pt-0">
        <div className="club-container">
          <SectionHeading kicker="TOGETHER, WE GO FURTHER" title="PARTNERS IN OUR JOURNEY" />
          {sponsors.length ? (
            <div className="record-grid">
              {sponsors.map((r) => (
                <RecordCard record={r} key={r.id} />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap justify-between gap-5 border-y border-border py-7 items-center">
              <p className="text-sm text-muted-foreground">Partner with the pride of Ijebu-Ode.</p>
              <Link to="/contact" className="section-link">
                BECOME A CLUB PARTNER <ArrowUpRight />
              </Link>
            </div>
          )}
        </div>
      </section>
      <section className="fan-band">
        <div className="club-container">
          <div>
            <h2>
              THIS IS YOUR CLUB. <span>BE PART OF IT.</span>
            </h2>
            <p>From Ijebu-Ode to wherever you call home. Stand with the Boyz.</p>
          </div>
          <Button asChild variant="secondary" className="h-12 text-[11px]">
            <Link to="/fans">
              JOIN THE AWUJALE FAMILY <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
