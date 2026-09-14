import fs from "node:fs";

const runtimeFiles = [
  "frontend/js/auth.js",
  "frontend/js/db.js",
  "frontend/js/app.js",
  "frontend/js/company.js",
  "frontend/js/excel-import.js",
  "frontend/checkin.html",
  "frontend/super-dashboard.html",
  "frontend/ad-manager.html"
];

let failed = false;
for (const file of runtimeFiles) {
  const text = fs.readFileSync(file, "utf8");
  const withoutArrayFrom = text.replaceAll("Array.from(", "");
  if (/\.from\s*\(/.test(withoutArrayFrom)) {
    console.error(`SECURITY: direct Supabase table access found in ${file}`);
    failed = true;
  }
}

const readme = fs.readFileSync("README.md", "utf8");
if (/superadmin\s*\|\s*1234/i.test(readme) || /login as\s+`?superadmin`?\s*\/\s*`?1234/i.test(readme)) {
  console.error("SECURITY: published default Super Admin credentials found in README.md");
  failed = true;
}

const migration = fs.readFileSync("database/security_foundation.sql", "utf8");
for (const required of [
  "app_validate_session",
  "app_login",
  "app_get_customers",
  "app_save_recovery",
  "FINAL LOCKDOWN",
  "revoke all on table"
]) {
  if (!migration.includes(required)) {
    console.error(`SECURITY: migration missing required control: ${required}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log("Security regression checks passed.");
