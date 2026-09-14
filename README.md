# Recountix

**Version:** 3.0.0 – Production SaaS (Supabase Multi-Tenant)

Commercial jewellery recovery management for multiple jewellers.  
Only Super Admin can onboard new companies. No public registration.

## Features

- Premium UI (luxury jewellery theme)
- Supabase-only backend (no LocalStorage / Firebase data)
- Super Admin: dashboard, company CRUD, activate/deactivate, subscriptions, renew
- Shop Admin / User: customers, recovery, reports, settings (scoped by `shop_id`)
- Excel template / bulk import / export
- Outstanding auto-update on recovery
- Reports: filter, CSV export, print
- Remember me + Forgot password (admin-assisted reset)
- Modular JavaScript

## Authentication

No default production credentials are published. Create a unique Super Admin credential during the
controlled deployment process, use a password manager, and rotate any earlier test credentials.

## Setup

1. Supabase → SQL Editor → run in order:
   - `database/supabase_schema.sql`
   - `database/super_admin_migration.sql`
2. Confirm tables: `shops`, `users`, `customers`, `recoveries`, `settings`, `subscriptions`, `audit_log`
3. Open `frontend/login.html` or deploy `frontend/` to GitHub Pages / any static host
4. Apply `database/security_foundation.sql` and follow `SECURITY_DEPLOYMENT.md`

## Supabase Config

`frontend/js/supabase.js`

- URL: `https://tmgpajynsvpjhpgrziue.supabase.co`
- Anon key: publishable key (already set)

## Structure

```
frontend/
  login.html, dashboard.html, customers.html, recovery.html,
  reports.html, settings.html, super-dashboard.html,
  companies.html, subscription.html
  css/style.css
  js/
    supabase.js   – client + session
    auth.js       – login / roles / logout
    utils.js      – formatters / helpers
    db.js         – all Supabase CRUD
    app.js        – customers, recovery, reports, settings UI
    company.js    – super-admin company & subscription UI
    excel-import.js
database/
  supabase_schema.sql
  super_admin_migration.sql
```

## Security notes

- Browser sessions are verified by server-side RPCs and expire automatically.
- Business tables use deny-by-default RLS; browser access is through scoped RPCs.
- Tenant identity and roles are derived server-side, never trusted from browser storage.
- Follow [SECURITY_DEPLOYMENT.md](SECURITY_DEPLOYMENT.md) before any production rollout.

## Developed by

**BK Design Hub** · Recountix Commercial Edition
