import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  MapPin,
  Shield,
  Search,
  Trophy,
  Users,
  Newspaper,
  ImageIcon,
  X,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { clubQuery } from "@/lib/club.queries";
import { calculateStandings, type ClubRecord, type Kind } from "@/lib/club";
import { Crest, PageHeading } from "./shell";
import training from "@/assets/club-training.asset.json";
import matchday from "@/assets/club-matchday.asset.json";
export function Empty({
  title,
  description,
  icon: Icon = Shield,
}: {
  title: string;
  description: string;
  icon?: typeof Shield;
}) {
  return (
    <div className="empty-state">
      <Icon />
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
export function SectionHeading({
  kicker,
  title,
  to,
  label = "View all",
}: {
  kicker: string;
  title: string;
  to?: "/" | "/squad" | "/news" | "/fixtures" | "/gallery" | "/about" | "/standings" | "/honours";
  label?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <div className="kicker">{kicker}</div>
        <h2>{title}</h2>
      </div>
      {to && (
        <Link to={to} className="section-link">
          {label}
          <ArrowUpRight />
        </Link>
      )}
    </div>
  );
}
export function Countdown({ date }: { date: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  if (now === null) return null;
  const seconds = Math.max(0, Math.floor((Date.parse(date) - now) / 1000));
  if (!Number.isFinite(seconds) || !seconds) return null;
  return (
    <div className="countdown">
      {[
        [Math.floor(seconds / 86400), "DAYS"],
        [Math.floor(seconds / 3600) % 24, "HRS"],
        [Math.floor(seconds / 60) % 60, "MINS"],
        [seconds % 60, "SECS"],
      ].map(([v, label]) => (
        <div key={label}>
          <strong>{String(v).padStart(2, "0")}</strong>
          <small>{label}</small>
        </div>
      ))}
    </div>
  );
}
export function MatchCard({
  record,
  next = false,
}: {
  record?: ClubRecord | undefined;
  next?: boolean;
}) {
  const d = record?.details;
  return (
    <div className="match-card">
      <div className="match-card-header">
        <span>{next ? "NEXT MATCH" : "LATEST RESULT"}</span>
        <span className="status-tag">{d?.competition || "AWAITING CONFIRMATION"}</span>
      </div>
      <div className="match-teams">
        <div className="team">
          <Crest />
          <span className="team-name">{d?.homeTeam || "AWUJALE BOYZ FC"}</span>
        </div>
        <span className="versus">
          {d?.status === "Completed" ? `${d.homeScore} – ${d.awayScore}` : "VS"}
        </span>
        <div className="team">
          <span className="opponent-crest">
            <Shield size={27} />
          </span>
          <span className="team-name">{d?.awayTeam || "TO BE ANNOUNCED"}</span>
        </div>
      </div>
      {record && next && d?.kickoff && <Countdown date={d.kickoff} />}
      <div className="match-meta">
        <span>
          <CalendarDays />
          {d?.kickoff
            ? new Date(d.kickoff).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                timeZone: "Africa/Lagos",
              })
            : "Date to be confirmed"}
        </span>
        <span>
          <MapPin />
          {d?.venue || "Venue to be confirmed"}
        </span>
      </div>
      {record ? (
        <div className="p-4 text-center">
          <Link
            to="/matches/$matchId"
            params={{ matchId: record.id }}
            className="section-link justify-center"
          >
            Match centre <ArrowUpRight />
          </Link>
        </div>
      ) : (
        <p className="match-note">
          {next
            ? "The next chapter starts on the pitch. Official fixture details will appear here."
            : "Official results will be published after confirmation by the club."}
        </p>
      )}
    </div>
  );
}
export function RecordCard({ record }: { record: ClubRecord }) {
  const d = record.details;
  return (
    <div className="record-card">
      {d.image ? (
        <img src={d.image} alt={record.title} loading="lazy" />
      ) : (
        <div className="club-wordmark">
          AWUJALE
          <br />
          <span>BOYZ FC</span>
          <Shield />
        </div>
      )}
      <div className="record-content">
        <div className="eyebrow text-muted-foreground">
          {d.position || d.category || record.kind}
        </div>
        <h2>{record.title}</h2>
        {d.number !== undefined && (
          <span className="profile-number">{String(d.number).padStart(2, "0")}</span>
        )}
        {d.excerpt && <p>{d.excerpt}</p>}
        {record.kind === "players" && (
          <>
            <p>
              {d.nationality} · {d.status || "First team"}
            </p>
            <Link
              className="section-link mt-4"
              to="/squad/$playerId"
              params={{ playerId: record.id }}
            >
              Player profile
              <ArrowUpRight />
            </Link>
          </>
        )}
        {record.kind === "news" && (
          <>
            <p>
              {d.date ? new Date(d.date).toLocaleDateString("en-GB") : ""}{" "}
              {d.author && `· ${d.author}`}
            </p>
            <Link
              className="section-link mt-4"
              to="/news/$slug"
              params={{ slug: record.slug || record.id }}
            >
              Read story
              <ArrowUpRight />
            </Link>
          </>
        )}
        {record.kind === "honours" && (
          <p>
            {d.date} {d.body}
          </p>
        )}
        {record.kind === "sponsors" && d.link && (
          <a href={d.link} target="_blank" rel="noreferrer" className="section-link mt-4">
            Visit partner
            <ArrowUpRight />
          </a>
        )}
      </div>
    </div>
  );
}
export function SquadPage() {
  const { data } = useSuspenseQuery(clubQuery);
  const [position, setPosition] = useState("All players");
  const [search, setSearch] = useState("");
  const players = data.filter(
    (r) =>
      r.kind === (position === "Coaching staff" ? "staff" : "players") &&
      (position === "All players" ||
        position === "Coaching staff" ||
        r.details.position === position) &&
      r.title.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <PageHeading
        eyebrow="OUR FIRST TEAM"
        title="THE BOYZ. OUR PRIDE."
        description="One badge. One ambition. Meet the players and coaches representing AWUJALE BOYZ FC."
      />
      <div className="page-body club-container">
        <div className="filters">
          {["All players", "Goalkeeper", "Defender", "Midfielder", "Forward", "Coaching staff"].map(
            (p) => (
              <Button
                key={p}
                variant="ghost"
                className={p === position ? "active-filter" : ""}
                onClick={() => setPosition(p)}
              >
                {p}
              </Button>
            ),
          )}
          <div className="search-wrap">
            <Search />
            <input
              className="form-input"
              aria-label="Search players"
              placeholder="Search the squad"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {players.length ? (
          <div className="record-grid">
            {players.map((r) => (
              <RecordCard key={r.id} record={r} />
            ))}
          </div>
        ) : (
          <Empty
            icon={Users}
            title={search ? "No matching players" : "Squad announcement coming soon"}
            description="Verified player profiles and coaching appointments will be published here by the club."
          />
        )}
      </div>
    </>
  );
}
export function FixturesPage() {
  const { data } = useSuspenseQuery(clubQuery);
  const [status, setStatus] = useState("All matches");
  const [competition, setCompetition] = useState("All competitions");
  const [season, setSeason] = useState("All seasons");
  const fixtures = data.filter((r) => r.kind === "fixtures");
  const filtered = fixtures
    .filter(
      (r) =>
        (status === "All matches" || r.details.status === status) &&
        (competition === "All competitions" || r.details.competition === competition) &&
        (season === "All seasons" || r.details.season === season),
    )
    .sort((a, b) => Date.parse(a.details.kickoff || "") - Date.parse(b.details.kickoff || ""));
  return (
    <>
      <PageHeading
        eyebrow="MATCH CENTRE"
        title="FIXTURES & RESULTS"
        description="Every kick-off. Every final whistle. Follow the journey of AWUJALE BOYZ FC."
      />
      <div className="club-container page-body">
        <div className="filters">
          {["All matches", "Upcoming", "Completed"].map((s) => (
            <Button
              key={s}
              variant="ghost"
              className={status === s ? "active-filter" : ""}
              onClick={() => setStatus(s)}
            >
              {s}
            </Button>
          ))}
          <select
            className="form-input w-auto"
            aria-label="Competition"
            value={competition}
            onChange={(e) => setCompetition(e.target.value)}
          >
            <option>All competitions</option>
            {[...new Set(fixtures.map((r) => r.details.competition).filter(Boolean))].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            className="form-input w-auto"
            aria-label="Season"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
          >
            <option>All seasons</option>
            {[...new Set(fixtures.map((r) => r.details.season).filter(Boolean))].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        {filtered.length ? (
          <div className="record-grid">
            {filtered.map((r) => (
              <MatchCard key={r.id} record={r} next={r.details.status === "Upcoming"} />
            ))}
          </div>
        ) : (
          <Empty
            icon={CalendarDays}
            title="The schedule is taking shape"
            description="Confirmed competitions, opponents, venues and kick-off times will appear here. No fixtures have been announced yet."
          />
        )}
      </div>
    </>
  );
}
export function StandingsPage() {
  const { data } = useSuspenseQuery(clubQuery);
  const [competition, setCompetition] = useState("");
  const [season, setSeason] = useState("");
  const comps = data.filter((r) => r.kind === "competitions");
  const chosen = comps.find((r) => r.title === (competition || comps[0]?.title));
  const matches = data.filter(
    (r) =>
      r.kind === "fixtures" &&
      r.details.competition === chosen?.title &&
      r.details.season === (season || chosen?.details.season || ""),
  );
  const rules = {
    win: chosen?.details.winPoints ?? 3,
    draw: chosen?.details.drawPoints ?? 1,
    loss: chosen?.details.lossPoints ?? 0,
  };
  const rows = calculateStandings(
    matches,
    data
      .filter(
        (r) =>
          r.kind === "teams" &&
          r.details.competition === chosen?.title &&
          r.details.season === (season || chosen?.details.season || ""),
      )
      .map((r) => r.title),
    rules,
  );
  return (
    <>
      <PageHeading
        eyebrow="THE COMPETITION"
        title="LEAGUE STANDINGS"
        description="The full picture. Standings calculated from officially recorded competition results."
      />
      <div className="club-container page-body">
        <div className="filters">
          <select
            className="form-input w-auto"
            aria-label="Standings competition"
            value={competition || comps[0]?.title || ""}
            onChange={(e) => setCompetition(e.target.value)}
          >
            {!comps.length && <option value="">Competition to be confirmed</option>}
            {comps.map((c) => (
              <option key={c.id}>{c.title}</option>
            ))}
          </select>
          <select
            className="form-input w-auto"
            aria-label="Standings season"
            value={season || chosen?.details.season || ""}
            onChange={(e) => setSeason(e.target.value)}
          >
            <option value="">Select season</option>
            {[
              ...new Set(
                data
                  .filter((r) => r.kind === "fixtures")
                  .map((r) => r.details.season)
                  .filter(Boolean),
              ),
            ].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="table-scroll">
          <table className="standings-table">
            <thead>
              <tr>
                {["POS", "CLUB", "P", "W", "D", "L", "GF", "GA", "GD", "PTS"].map((t) => (
                  <th key={t}>{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.club} className={r.club === "AWUJALE BOYZ FC" ? "club-highlight" : ""}>
                  {[
                    i + 1,
                    r.club,
                    r.played,
                    r.won,
                    r.drawn,
                    r.lost,
                    r.gf,
                    r.ga,
                    r.gd,
                    r.points,
                  ].map((v, j) => (
                    <td key={j}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!rows.length && (
          <Empty
            icon={Trophy}
            title="Official standings coming soon"
            description="Competition entries and verified results are needed before the league table can be published."
          />
        )}
        {rows.length > 0 && (
          <p className="temporary-caption">
            Win: {rules.win} pts · Draw: {rules.draw} pts · Loss: {rules.loss} pts. Ties ordered by
            goal difference, goals scored, then club name.
          </p>
        )}
      </div>
    </>
  );
}
export function NewsPage() {
  const { data } = useSuspenseQuery(clubQuery);
  const [category, setCategory] = useState("All news");
  const [search, setSearch] = useState("");
  const news = data.filter((r) => r.kind === "news");
  const filtered = news.filter(
    (r) =>
      (category === "All news" || r.details.category === category) &&
      r.title.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <PageHeading
        eyebrow="INSIDE THE CLUB"
        title="THE LATEST FROM THE BOYZ"
        description="Stories from the pitch, the training ground and our community."
      />
      <div className="club-container page-body">
        <div className="filters">
          {["All news", "Club updates", "Match reports", "Training", "Community"].map((c) => (
            <Button
              key={c}
              variant="ghost"
              className={c === category ? "active-filter" : ""}
              onClick={() => setCategory(c)}
            >
              {c}
            </Button>
          ))}
          <div className="search-wrap">
            <Search />
            <input
              className="form-input"
              aria-label="Search news"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stories"
            />
          </div>
        </div>
        {filtered.length ? (
          <div className="record-grid">
            {filtered.map((r) => (
              <RecordCard key={r.id} record={r} />
            ))}
          </div>
        ) : (
          <Empty
            icon={Newspaper}
            title="A new chapter is coming"
            description="Official announcements, match reports and club stories will appear here as they are published."
          />
        )}
      </div>
    </>
  );
}
export function GalleryPage() {
  const { data } = useSuspenseQuery(clubQuery);
  const [category, setCategory] = useState("All media");
  const [selected, setSelected] = useState<{
    image?: string | undefined;
    video?: string | undefined;
    title: string;
  } | null>(null);
  useEffect(() => {
    if (!selected) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [selected]);
  const media = data.filter(
    (r) => r.kind === "gallery" && (category === "All media" || r.details.category === category),
  );
  const samples = [
    { image: matchday.url, title: "Matchday inspiration · AI-generated temporary imagery" },
    { image: training.url, title: "Training inspiration · AI-generated temporary imagery" },
  ];
  return (
    <>
      <PageHeading
        eyebrow="THROUGH THE LENS"
        title="THE GAME. THE MOMENTS."
        description="Matchday, training and life beyond the pitch. Explore the club’s photo and video collection."
      />
      <div className="club-container page-body">
        <div className="filters">
          {["All media", "Matchday", "Training", "Behind the scenes", "Videos"].map((c) => (
            <Button
              key={c}
              variant="ghost"
              className={c === category ? "active-filter" : ""}
              onClick={() => setCategory(c)}
            >
              {c}
            </Button>
          ))}
        </div>
        {media.length ? (
          <div className="gallery-grid">
            {media.map((r) => (
              <Button
                className="gallery-item"
                variant="ghost"
                key={r.id}
                aria-label={`Open ${r.title}`}
                onClick={() =>
                  setSelected({ image: r.details.image, video: r.details.video, title: r.title })
                }
              >
                {r.details.image ? (
                  <img src={r.details.image} alt={r.title} loading="lazy" />
                ) : (
                  <span className="p-10">{r.title} · Play video</span>
                )}
              </Button>
            ))}
          </div>
        ) : (
          <>
            <Empty
              icon={ImageIcon}
              title="Official club moments coming soon"
              description="The photographs below are temporary visual inspiration, not actual club players or events."
            />
            {category === "All media" && (
              <div className="gallery-grid mt-8">
                {samples.map((s) => (
                  <Button
                    variant="ghost"
                    className="gallery-item"
                    key={s.image}
                    aria-label={`Open ${s.title}`}
                    onClick={() => setSelected(s)}
                  >
                    <img src={s.image} alt={s.title} />
                    <span className="image-label absolute bottom-3 left-3">
                      TEMPORARY · AI-GENERATED
                    </span>
                  </Button>
                ))}
              </div>
            )}
          </>
        )}
        {selected && (
          <div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
            onClick={() => setSelected(null)}
          >
            <Button
              variant="stadium"
              size="icon"
              className="lightbox-close"
              autoFocus
              aria-label="Close image"
              onClick={() => setSelected(null)}
            >
              <X />
            </Button>
            {selected.video ? (
              <video controls autoPlay src={selected.video} onClick={(e) => e.stopPropagation()} />
            ) : (
              <img src={selected.image} alt={selected.title} onClick={(e) => e.stopPropagation()} />
            )}
            <span className="lightbox-caption">{selected.title}</span>
          </div>
        )}
      </div>
    </>
  );
}
export function HonoursPage() {
  const { data } = useSuspenseQuery(clubQuery);
  const honours = data.filter((r) => r.kind === "honours");
  return (
    <>
      <PageHeading
        eyebrow="OUR COMPETITIVE JOURNEY"
        title="EARNED. NEVER GIVEN."
        description="A record of verified trophies, honours and milestones in the AWUJALE BOYZ FC journey."
      />
      <div className="club-container page-body">
        {honours.length ? (
          <div className="record-grid">
            {honours.map((r) => (
              <RecordCard record={r} key={r.id} />
            ))}
          </div>
        ) : (
          <Empty
            icon={Trophy}
            title="Our story is still being written"
            description="Only verified club honours and achievements will be recorded here. Official records are awaiting confirmation."
          />
        )}
      </div>
    </>
  );
}
export function AboutPage() {
  const { data } = useSuspenseQuery(clubQuery);
  const settings = data.find((r) => r.kind === "settings");
  const staff = data.filter((r) => r.kind === "staff");
  return (
    <>
      <PageHeading
        eyebrow="ROOTED IN IJEBU-ODE"
        title="MORE THAN A TEAM."
        description="AWUJALE BOYZ FC. A football club from Ijebu-Ode, Ogun State, Nigeria — united by passion for the beautiful game."
      />
      <div className="club-container page-body">
        <div className="content-split">
          <div>
            <div className="eyebrow text-muted-foreground">OUR IDENTITY</div>
            <h2 className="mt-5">
              OUR CITY. OUR COLOURS.
              <br />
              <span className="text-primary">OUR CLUB.</span>
            </h2>
            <p>
              {settings?.details.body ||
                "AWUJALE BOYZ FC represents the pride and football spirit of Ijebu-Ode. Our colours are deep royal navy and gold. Our ambition is to build a football community rooted in passion, unity and a love of the game."}
            </p>
            <p>
              Official founding history, leadership appointments and club milestones are awaiting
              verified club information.
            </p>
            <Button asChild variant="gold" className="mt-6">
              <Link to="/fans">
                Be part of our journey <ArrowUpRight />
              </Link>
            </Button>
          </div>
          <div>
            <img
              className="content-image"
              src={training.url}
              alt="Temporary AI-generated Nigerian football training imagery"
            />
            <p className="temporary-caption">
              Temporary AI-generated imagery · Not actual AWUJALE BOYZ FC players.
            </p>
          </div>
        </div>
        <div className="values-row">
          {[
            ["Pride", "Rooted in Ijebu-Ode. Representing our community."],
            ["Unity", "One badge. One team. One shared ambition."],
            ["Passion", "A genuine love for football, on and off the pitch."],
            ["Discipline", "Commitment to respect, dedication and the game."],
          ].map(([name, text]) => (
            <div key={name}>
              <h3>{name}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-14">
          <SectionHeading kicker="THE PEOPLE BEHIND THE BADGE" title="Leadership & coaching" />
          {staff.length ? (
            <div className="record-grid">
              {staff.map((r) => (
                <RecordCard key={r.id} record={r} />
              ))}
            </div>
          ) : (
            <Empty
              title="Official appointments to follow"
              description="Club leadership and coaching profiles will be published once confirmed."
            />
          )}
        </div>
      </div>
    </>
  );
}
export function DetailPage({ kind, id }: { kind: Kind; id: string }) {
  const { data } = useSuspenseQuery(clubQuery);
  const r = data.find((r) => r.kind === kind && (r.id === id || r.slug === id));
  if (!r)
    return (
      <>
        <PageHeading
          title="RECORD NOT AVAILABLE"
          description="This record has not been published or is no longer available."
        />
        <div className="club-container page-body">
          <Empty
            title="Nothing published here yet"
            description="Please return to the club’s latest confirmed records."
          />
          <Button asChild variant="gold" className="mt-6">
            <Link to="/">Back to the club</Link>
          </Button>
        </div>
      </>
    );
  const d = r.details;
  return (
    <>
      <PageHeading
        eyebrow={d.category || d.position || "OFFICIAL CLUB RECORD"}
        title={r.title.toUpperCase()}
        description={d.excerpt || `${d.competition || ""} ${d.season || ""}`}
      />
      <div className="club-container page-body">
        <article className="article">
          {kind === "fixtures" && <MatchCard record={r} />}{" "}
          {d.image && <img src={d.image} alt={r.title} />}{" "}
          {kind === "players" && (
            <div className="stats-grid">
              {[
                ["NUMBER", d.number],
                ["APPEARANCES", d.appearances],
                ["GOALS", d.goals],
                ["ASSISTS", d.assists],
              ].map(([label, v]) => (
                <div className="stat" key={label}>
                  <strong>{v ?? "—"}</strong>
                  <p>{label}</p>
                </div>
              ))}
            </div>
          )}
          <p className="temporary-caption mb-6">
            {d.author && `By ${d.author} · `}
            {d.date || d.position || d.venue}
          </p>
          <div className="article-text">
            {d.body || "Further verified details will be published by the club."}
          </div>
          {kind === "news" && (
            <Button
              variant="outline"
              className="mt-7"
              onClick={async () => {
                if (navigator.share)
                  await navigator.share({ title: r.title, url: window.location.href });
                else {
                  await navigator.clipboard.writeText(window.location.href);
                  const { toast } = await import("sonner");
                  toast.success("Article link copied");
                }
              }}
            >
              Share story
              <ArrowUpRight />
            </Button>
          )}
        </article>
        {kind === "news" && (
          <div className="mt-12">
            <SectionHeading kicker="MORE FROM THE CLUB" title="Related stories" to="/news" />
            <div className="record-grid">
              {data
                .filter((n) => n.kind === "news" && n.id !== r.id)
                .slice(0, 3)
                .map((n) => (
                  <RecordCard record={n} key={n.id} />
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
