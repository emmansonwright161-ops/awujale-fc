import { describe, it, expect } from "vitest";
import {
  canManage,
  clubResults,
  clubGoals,
  calculateStandings,
  recordSchema,
  supporterSchema,
  type ClubRecord,
} from "@/lib/club";
const match = (home: number | undefined, away: number | undefined, status = "Completed") =>
  ({
    id: "test",
    kind: "fixtures",
    title: "Test only",
    published: true,
    slug: null,
    created_at: "",
    details: {
      homeTeam: "AWUJALE BOYZ FC",
      awayTeam: "Test opponent",
      homeScore: home,
      awayScore: away,
      status,
    },
  }) as ClubRecord;
describe("Club data integrity", () => {
  it("excludes other league teams from club match statistics", () => {
    const unrelated = {
      ...match(5, 2),
      details: { ...match(5, 2).details, homeTeam: "Other team", awayTeam: "Another team" },
    };
    expect(clubResults([match(2, 0), unrelated])).toHaveLength(1);
    expect(clubGoals([match(2, 0), unrelated])).toBe(2);
  });
  it("counts the club goals correctly in away matches", () => {
    const away = {
      ...match(1, 3),
      details: { ...match(1, 3).details, homeTeam: "Test opponent", awayTeam: "AWUJALE BOYZ FC" },
    };
    expect(clubGoals([away])).toBe(3);
  });
  it("does not calculate standings from unverified scores", () => {
    expect(calculateStandings([match(undefined, undefined)])).toEqual([]);
  });
  it("calculates standings automatically from recorded results", () => {
    const rows = calculateStandings([match(2, 0)]);
    expect(rows[0]).toMatchObject({
      club: "AWUJALE BOYZ FC",
      played: 1,
      won: 1,
      points: 3,
      gf: 2,
      ga: 0,
      gd: 2,
    });
  });
  it("supports configurable competition scoring", () => {
    expect(calculateStandings([match(1, 1)], [], { win: 5, draw: 2, loss: 0 })[0]?.points).toBe(2);
  });
  it("prevents publishing a completed match without official scores", () => {
    expect(
      recordSchema.safeParse({
        kind: "fixtures",
        title: "Unverified match",
        published: true,
        details: {
          status: "Completed",
          homeTeam: "A",
          awayTeam: "B",
          kickoff: "2026-11-20",
          competition: "C",
          season: "2026",
        },
      }).success,
    ).toBe(false);
  });
  it("requires consent for supporter registration", () => {
    expect(
      supporterSchema.safeParse({
        name: "Test supporter",
        email: "test@example.com",
        consent: false,
      }).success,
    ).toBe(false);
  });
  it("allows editors only editorial modules", () => {
    expect(canManage(["editor"], "news")).toBe(true);
    expect(canManage(["editor"], "players")).toBe(false);
    expect(canManage(["editor"], "settings")).toBe(false);
  });
  it("restricts matchday staff to football records", () => {
    expect(canManage(["matchday_manager"], "fixtures")).toBe(true);
    expect(canManage(["matchday_manager"], "news")).toBe(false);
  });
  it("does not grant staff privileges to a regular signed-in account", () => {
    expect(canManage([], "settings")).toBe(false);
  });
});
