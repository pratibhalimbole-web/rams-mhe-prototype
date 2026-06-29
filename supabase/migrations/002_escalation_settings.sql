-- ─── Escalation SLA Rules ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.escalation_sla_rules (
  level                TEXT PRIMARY KEY,   -- L1 | L2 | L3 | L4
  role                 TEXT NOT NULL,
  sla_hours            INT  NOT NULL DEFAULT 2,
  on_breach            TEXT NOT NULL DEFAULT 'escalate', -- escalate | reassign | both
  reassign_after_hours INT  NOT NULL DEFAULT 24,
  max_reassigns        INT  NOT NULL DEFAULT 1,
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.escalation_sla_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON public.escalation_sla_rules FOR ALL USING (true) WITH CHECK (true);

-- Seed defaults
INSERT INTO public.escalation_sla_rules (level, role, sla_hours, on_breach, reassign_after_hours, max_reassigns)
VALUES
  ('L1', 'Operator / Technician', 2,  'escalate', 24,  1),
  ('L2', 'Supervisor',            4,  'escalate', 48,  2),
  ('L3', 'Operations Manager',    8,  'both',     72,  1),
  ('L4', 'Director',              24, 'both',     168, 1)
ON CONFLICT (level) DO NOTHING;

-- ─── Escalation Level Contacts ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.escalation_contacts (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  level         TEXT NOT NULL,  -- L1 | L2 | L3 | L4
  name          TEXT NOT NULL,
  email         TEXT NOT NULL DEFAULT '',
  phone         TEXT NOT NULL DEFAULT '',
  display_order INT  NOT NULL DEFAULT 0
);

ALTER TABLE public.escalation_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON public.escalation_contacts FOR ALL USING (true) WITH CHECK (true);

-- Seed defaults
INSERT INTO public.escalation_contacts (level, name, email, phone, display_order)
VALUES
  ('L1', 'Safety Team',       'safety-l1@warehouse.com',   '+91-98765-00001', 0),
  ('L1', 'Maintenance Desk',  'maint-l1@warehouse.com',    '',                1),
  ('L2', 'Shift Supervisors', 'supervisors@warehouse.com', '+91-98765-00002', 0),
  ('L3', 'Ops Management',    'ops-mgmt@warehouse.com',    '+91-98765-00003', 0),
  ('L4', 'Fleet Director',    'director@warehouse.com',    '+91-98765-00004', 0),
  ('L4', 'CEO Office (CC)',   'ceo-office@warehouse.com',  '',                1)
ON CONFLICT (id) DO NOTHING;

-- ─── Global Escalation Settings ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.escalation_global_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

ALTER TABLE public.escalation_global_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON public.escalation_global_settings FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.escalation_global_settings (key, value)
VALUES
  ('critical_breach_days', '3'),
  ('auto_close_days', '7')
ON CONFLICT (key) DO NOTHING;
