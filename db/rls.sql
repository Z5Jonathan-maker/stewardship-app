-- Row-Level Security policies (Phase 1, step 7).
-- Apply AFTER the generated schema migration. These enforce hard tenant
-- isolation at the database, on top of the application data-access guard.
--
-- The app sets the current household per request via:
--   SELECT set_config('app.household_id', $1, true);
-- and connects as a non-superuser role. Policies then restrict every domain
-- row to that household. (Drizzle Kit doesn't generate RLS, so this is
-- maintained by hand and applied with: psql "$DATABASE_URL_UNPOOLED" -f db/rls.sql)

ALTER TABLE accounts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets           ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals             ENABLE ROW LEVEL SECURITY;
ALTER TABLE seeds             ENABLE ROW LEVEL SECURITY;
ALTER TABLE plaid_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE household_members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION current_household() RETURNS uuid AS $$
  SELECT NULLIF(current_setting('app.household_id', true), '')::uuid;
$$ LANGUAGE sql STABLE;

DO $$
DECLARE tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'accounts','transactions','budgets','goals','seeds','plaid_items'
  ] LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS tenant_isolation ON %I;', tbl);
    EXECUTE format(
      'CREATE POLICY tenant_isolation ON %I USING (household_id = current_household()) WITH CHECK (household_id = current_household());',
      tbl);
  END LOOP;
END $$;

-- household_members is keyed differently (composite) but still scoped.
DROP POLICY IF EXISTS member_isolation ON household_members;
CREATE POLICY member_isolation ON household_members
  USING (household_id = current_household())
  WITH CHECK (household_id = current_household());
