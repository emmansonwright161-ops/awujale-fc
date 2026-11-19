import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  recordSchema,
  contactSchema,
  supporterSchema,
  type ClubRecord,
  type Details,
} from "./club";
import { z } from "zod";
async function publicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Club connection unavailable");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
          h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}
async function resolveImages(rows: ClubRecord[]) {
  const mediaKeys = ["image", "video", "homeCrest", "awayCrest"] as const;
  const paths = [
    ...new Set(
      rows
        .flatMap((r) => mediaKeys.map((k) => r.details[k]))
        .filter((p): p is string => Boolean(p?.startsWith("club/"))),
    ),
  ];
  if (!paths.length) return rows;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.storage
    .from("club-media")
    .createSignedUrls(paths, 3600);
  if (error) throw error;
  const browserBase = import.meta.env['VITE_SUPABASE_URL'];
  const urls = new Map(
    data?.map((i) => [
      i.path,
      i.signedUrl && browserBase
        ? i.signedUrl.replace(new URL(i.signedUrl).origin, browserBase)
        : i.signedUrl,
    ]),
  );
  return rows.map((r) => {
    const details = { ...r.details };
    for (const key of mediaKeys) {
      const value = details[key];
      if (value?.startsWith("club/")) details[key] = urls.get(value) || value;
    }
    return { ...r, details };
  });
}
export const getPublished = createServerFn({ method: "GET" }).handler(async () => {
  const db = await publicClient();
  const { data, error } = await db
    .from("club_records")
    .select("id,kind,title,slug,published,details,created_at")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) throw new Error("Club content could not be loaded. Please try again.");
  return resolveImages((data || []) as ClubRecord[]);
});
export const getStaffData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: roles, error: roleError } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (roleError) throw roleError;
    if (!roles?.length) return { roles: [], records: [], supporters: [], messages: [] };
    const { data, error } = await context.supabase
      .from("club_records")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    const isAdmin = roles.some((r) => ["super_admin", "club_admin"].includes(r.role));
    const supporters = isAdmin
      ? await context.supabase
          .from("supporters")
          .select("*")
          .order("created_at", { ascending: false })
      : { data: [] };
    const messages = isAdmin
      ? await context.supabase
          .from("contact_messages")
          .select("*")
          .order("created_at", { ascending: false })
      : { data: [] };
    return {
      roles: roles.map((r) => r.role),
      records: (data || []).map((r) => ({ ...r, details: r.details as Details })) as ClubRecord[],
      supporters: supporters.data || [],
      messages: messages.data || [],
    };
  });
export const saveRecord = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(recordSchema)
  .handler(async ({ data, context }) => {
    const { data: allowed } = await context.supabase.rpc("can_manage_club", { _kind: data.kind });
    if (!allowed) throw new Error("You do not have permission to edit this content.");
    const payload = {
      kind: data.kind,
      title: data.title,
      slug: data.slug || null,
      published: data.published,
      details: data.details,
      updated_at: new Date().toISOString(),
    };
    const result = data.id
      ? await context.supabase
          .from("club_records")
          .update(payload)
          .eq("id", data.id)
          .select("id")
          .single()
      : await context.supabase.from("club_records").insert(payload).select("id").single();
    if (result.error) throw new Error(result.error.message);
    return result.data;
  });
export const deleteRecord = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid(), kind: z.string() }))
  .handler(async ({ data, context }) => {
    const { data: allowed } = await context.supabase.rpc("can_manage_club", { _kind: data.kind });
    if (!allowed) throw new Error("Permission denied");
    const { error } = await context.supabase
      .from("club_records")
      .delete()
      .eq("id", data.id)
      .eq("kind", data.kind);
    if (error) throw error;
    return { success: true };
  });
export const registerSupporter = createServerFn({ method: "POST" })
  .inputValidator(supporterSchema)
  .handler(async ({ data }) => {
    const db = await publicClient();
    const { error } = await db.from("supporters").insert(data);
    if (error)
      throw new Error(
        error.code === "23505"
          ? "This email is already registered."
          : "Registration could not be saved. Please try again.",
      );
    return { success: true };
  });
export const sendContact = createServerFn({ method: "POST" })
  .inputValidator(contactSchema)
  .handler(async ({ data }) => {
    const db = await publicClient();
    const { error } = await db.from("contact_messages").insert(data);
    if (error) throw new Error("Your message could not be saved. Please try again.");
    return { success: true };
  });
export const getSetupStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("club_setup_available");
    if (error) throw new Error("Setup status could not be checked.");
    return { available: Boolean(data) };
  });
export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("claim_first_super_admin");
    if (error) throw new Error("Setup could not be completed.");
    if (!data) throw new Error("Club setup has already been completed.");
    return { success: true };
  });
