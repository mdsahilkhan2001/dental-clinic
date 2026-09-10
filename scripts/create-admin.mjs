/**
 * Create (or promote) a clinic admin.
 *
 *   node scripts/create-admin.mjs <email> <password> ["Full Name"]
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL and the service/secret key from .env.local
 * (or the process environment). Safe to run more than once — it upserts the
 * admin_users row and, if the auth user already exists, just links it.
 */

import { readFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { createClient } from "@supabase/supabase-js";

/** Prompt for a value on the TTY, masking input for passwords. */
function prompt(question, { mask = false } = {}) {
  return new Promise((resolve, reject) => {
    if (!process.stdin.isTTY) {
      reject(
        new Error(
          "No interactive terminal. Pass the password as the 2nd argument:\n" +
            '  npm run create-admin "email" "password" "Full Name"',
        ),
      );
      return;
    }
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    if (mask) {
      const onData = (char) => {
        const s = char.toString("utf8");
        if (s === "\n" || s === "\r" || s === "") {
          process.stdin.removeListener("data", onData);
        } else {
          process.stdout.write("[2K[200D" + question + "*".repeat(rl.line.length));
        }
      };
      process.stdin.on("data", onData);
    }
    rl.question(question, (answer) => {
      rl.close();
      if (mask) process.stdout.write("\n");
      resolve(answer);
    });
  });
}

// --- load .env.local (simple parser, no dependency) -------------------------
try {
  const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  /* no .env.local — rely on the environment */
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

const args = process.argv.slice(2);
const email = args[0];
let password = args[1];
const fullName = args[2] || "Clinic Admin";

// Treat the doc placeholder as "ask me".
const PLACEHOLDER = /^I_WILL_ENTER_MY_PASSWORD$/i;

if (!url || !serviceKey) {
  console.error(
    "\n  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY / SUPABASE_SECRET_KEY.\n" +
      "  Add them to .env.local first (Supabase dashboard -> Project Settings -> API).\n",
  );
  process.exit(1);
}
if (!email) {
  console.error(
    '\n  Usage: node scripts/create-admin.mjs <email> [password] ["Full Name"]\n' +
      "  Omit the password to be prompted for it (hidden input).\n",
  );
  process.exit(1);
}

if (!password || PLACEHOLDER.test(password)) {
  try {
    password = await prompt(`  Password for ${email}: `, { mask: true });
    const confirm = await prompt("  Confirm password: ", { mask: true });
    if (password !== confirm) {
      console.error("\n  Passwords did not match.\n");
      process.exit(1);
    }
  } catch (err) {
    console.error("\n  " + (err.message ?? err) + "\n");
    process.exit(1);
  }
}

if (!password || password.length < 8) {
  console.error("\n  Password must be at least 8 characters.\n");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(targetEmail) {
  let page = 1;
  // Paginate through users (fine for a small clinic team).
  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) throw error;
    const hit = data.users.find(
      (u) => u.email?.toLowerCase() === targetEmail.toLowerCase(),
    );
    if (hit) return hit;
    if (data.users.length < 200) return null;
    page += 1;
  }
}

async function main() {
  let userId;

  const { data: created, error: createErr } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

  if (createErr) {
    // Most likely: the user already exists. Look them up and reset the password.
    const existing = await findUserByEmail(email);
    if (!existing) throw createErr;
    userId = existing.id;
    await supabase.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
    });
    console.log(`  Auth user already existed — password reset. (${userId})`);
  } else {
    userId = created.user.id;
    console.log(`  Auth user created. (${userId})`);
  }

  const { error: upsertErr } = await supabase.from("admin_users").upsert(
    { id: userId, email, full_name: fullName, role: "super_admin" },
    { onConflict: "id" },
  );
  if (upsertErr) throw upsertErr;

  console.log("\n  ✅ Admin ready. Sign in at /admin/login\n");
  console.log(`     Email:    ${email}`);
  console.log(`     Password: ${password}\n`);
}

main().catch((err) => {
  console.error("\n  Failed:", err.message ?? err, "\n");
  process.exit(1);
});
