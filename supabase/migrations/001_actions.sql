-- ─── Actions Table ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.actions (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  source          TEXT NOT NULL DEFAULT 'system',
  issue_id        TEXT NOT NULL DEFAULT '',
  issue_title     TEXT NOT NULL DEFAULT '',
  issue_detail    TEXT NOT NULL DEFAULT '',
  suite           TEXT NOT NULL,
  severity        TEXT NOT NULL DEFAULT 'High',
  issue_source    TEXT NOT NULL DEFAULT 'Safety',
  action_type     TEXT NOT NULL DEFAULT 'Safety',
  title           TEXT NOT NULL,
  assigned_to     TEXT NOT NULL DEFAULT '',
  assigned_avatar TEXT NOT NULL DEFAULT '',
  priority        TEXT NOT NULL DEFAULT 'High',
  due_date        TEXT NOT NULL DEFAULT 'TBD',
  notes           TEXT NOT NULL DEFAULT '',
  status          TEXT NOT NULL DEFAULT 'assigned',
  is_overdue      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by      TEXT NOT NULL DEFAULT 'system'
);

-- Enable RLS
ALTER TABLE public.actions ENABLE ROW LEVEL SECURITY;

-- Open policy for prototype (tighten later with auth)
CREATE POLICY "allow_all" ON public.actions FOR ALL USING (true) WITH CHECK (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── Seed Mock Data ───────────────────────────────────────────────────────────

INSERT INTO public.actions (id, source, issue_id, suite, issue_source, issue_title, issue_detail, action_type, title, priority, assigned_to, assigned_avatar, due_date, status, is_overdue, created_by)
VALUES
  ('a1','system','ix1','MEPS','Safety',  'Unauthorized / invalid operation','MHE-003 · Bay 4 · Auth failure + wrong MHE type',      'Safety',     'Investigate unauthorized MHE start',      'Critical','Rahul Sharma',  'RS','Today, 3:00 PM', 'assigned',    FALSE,'system'),
  ('a2','system','ix2','MMS', 'Compliance','MHE compliance issue',          'MHE-011 · Fitness cert expired · MHE-006 · Insurance',  'Compliance', 'Ground MHE-011 and renew certifications', 'Critical','Neha Kapoor',   'NK','Today, 5:00 PM', 'assigned',    FALSE,'system'),
  ('a3','system','ix3','RTSS','Impact',  'Collision risk event',            'MHE-008 · Impact: 12G · Zone D · 09:47 AM',             'Safety',     'Review collision footage Zone D',          'Critical','Amit Desai',    'AD','Today, 2:00 PM', 'in-progress', TRUE, 'system'),
  ('a4','system','ix4','RTSS','Safety',  'High-risk driver score',          'Operator: Mohan Verma · Safety score: 19% · Bottom 5%', 'Safety',     'Suspend operator — safety score 19%',     'Critical','HR Team',       'HR','Yesterday',      'in-progress', TRUE, 'system'),
  ('a5','system','ix5','MEPS','Safety',  'Speed violation',                 'Operator: Prashant Rao · MHE-005 · Zone B',             'Operational','Speed violation coaching — Prashant Rao', 'High',    'Ops Manager',   'OM','Tomorrow, 10 AM','review',      FALSE,'system'),
  ('a6','system','ix6','MMS', 'Inspection','System health issue',           'MHE-010 · Jetson offline · 68hr buffer · MHE-005 LiDAR','Maintenance','Dispatch technician — Jetson Nano',       'Critical','IoT Team',      'IT','Today, 1:00 PM', 'review',      TRUE, 'system'),
  ('a7','system','ix7','MMS', 'Compliance','Operator compliance issue',     'Suresh Kumar · License expired · Vijay Nair · Medical', 'Compliance', 'Renew operator license — Suresh Kumar',   'High',    'Admin',         'AD','02 Apr',          'done',        FALSE,'system'),
  ('a8','system','ix8','RTSS','Safety',  'Pedestrian proximity breach',     'MHE-007 · Cross-aisle junction · 0.6m clearance',       'Safety',     'Fix pedestrian alert — Zone C',           'High',    'Safety Officer','SO','03 Apr',          'done',        FALSE,'system')
ON CONFLICT (id) DO NOTHING;
