import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { SETTINGS_DEFAULTS, type SettingsKey } from "./keys";
import { logger } from "@/lib/logger";

export async function getSettingGroup<K extends SettingsKey>(
  key: K
): Promise<(typeof SETTINGS_DEFAULTS)[K]> {
  const fallback = SETTINGS_DEFAULTS[key];
  if (!isSupabaseConfigured()) return fallback;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();

    if (error || !data) return fallback;
    return { ...fallback, ...(data.value as object) };
  } catch (error) {
    logger.error(`getSettingGroup(${key}) failed`, { error });
    return fallback;
  }
}
