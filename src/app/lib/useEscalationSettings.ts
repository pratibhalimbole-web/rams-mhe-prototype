import { useState, useEffect } from "react";
import {
  fetchEscalationSettings,
  DEFAULT_SETTINGS,
  type EscalationSettings,
  type Level,
} from "./escalation-settings-db";
import { supabase } from "../supabase-client";

// ─── Module-level singleton cache ─────────────────────────────────────────────
// Shared across all component instances — only one fetch + one subscription.

let _cached: EscalationSettings = DEFAULT_SETTINGS;
let _listeners: Set<(s: EscalationSettings) => void> = new Set();
let _initialized = false;
let _channel: ReturnType<typeof supabase.channel> | null = null;

function notifyAll(s: EscalationSettings) {
  _cached = s;
  _listeners.forEach(fn => fn(s));
}

function ensureInit() {
  if (_initialized) return;
  _initialized = true;

  fetchEscalationSettings().then(notifyAll).catch(() => {});

  _channel = supabase
    .channel("escalation-settings-singleton")
    .on("postgres_changes", { event: "*", schema: "public", table: "escalation_sla_rules" }, () => {
      fetchEscalationSettings().then(notifyAll).catch(() => {});
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "escalation_contacts" }, () => {
      fetchEscalationSettings().then(notifyAll).catch(() => {});
    })
    .subscribe();
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useEscalationSettings() {
  const [settings, setSettings] = useState<EscalationSettings>(_cached);

  useEffect(() => {
    ensureInit();
    // Register listener — gets called whenever cache updates
    _listeners.add(setSettings);
    // Sync latest cached value immediately (in case init already completed)
    setSettings(_cached);
    return () => { _listeners.delete(setSettings); };
  }, []);

  const getSLARule = (level: string) =>
    settings.slaRules.find(r => r.level === (level as Level)) ?? DEFAULT_SETTINGS.slaRules[0];

  const getContacts = (level: string) =>
    settings.contacts.filter(c => c.level === (level as Level));

  return { settings, getSLARule, getContacts };
}
