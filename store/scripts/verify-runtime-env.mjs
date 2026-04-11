const isVercel = process.env.VERCEL === "1";
const isProduction = process.env.VERCEL_ENV === "production";
const isStrict = isVercel && isProduction;

const requiredGroups = [
  {
    vars: ["DATABASE_URL"],
    reason: "Prisma/server routes need database connectivity.",
  },
  {
    vars: ["NEXTAUTH_SECRET", "AUTH_SECRET"],
    reason: "NextAuth requires a stable secret for session/JWT signing.",
  },
  {
    vars: ["NEXTAUTH_URL", "AUTH_URL", "NEXT_PUBLIC_SITE_URL"],
    reason: "Auth callbacks and canonical store origin require a valid URL.",
  },
];

const optionalGroups = [
  {
    vars: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
    reason: "Required only when Google sign-in should be enabled.",
  },
  {
    vars: ["STRIPE_SECRET_KEY", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"],
    reason: "Required only when Stripe checkout should be enabled.",
  },
  {
    vars: ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"],
    reason: "Required only when image upload endpoints should be enabled.",
  },
];

function hasValue(name) {
  const value = process.env[name];
  return typeof value === "string" && value.trim().length > 0;
}

function isGroupSatisfied(group) {
  return group.vars.some(hasValue);
}

function getMissingVars(group) {
  return group.vars.filter((name) => !hasValue(name));
}

const missingRequired = requiredGroups
  .filter((group) => !isGroupSatisfied(group))
  .map((group) => ({
    expectedOneOf: group.vars,
    reason: group.reason,
  }));

const missingOptional = optionalGroups
  .map((group) => ({
    missing: getMissingVars(group),
    reason: group.reason,
    vars: group.vars,
  }))
  .filter((entry) => entry.missing.length > 0);

if (missingRequired.length > 0) {
  const lines = [
    "[store] Missing required environment configuration:",
    ...missingRequired.map(
      (entry) =>
        ` - One of (${entry.expectedOneOf.join(" | ")}) is required. ${entry.reason}`
    ),
  ];

  if (isStrict) {
    console.error(lines.join("\n"));
    process.exit(1);
  }

  console.warn(lines.join("\n"));
}

if (missingOptional.length > 0) {
  console.warn("[store] Optional env groups are incomplete:");
  for (const group of missingOptional) {
    console.warn(
      ` - Missing: ${group.missing.join(", " )}. Group: (${group.vars.join(" + ")}). ${group.reason}`
    );
  }
}

if (missingRequired.length === 0) {
  console.log("[store] Required environment configuration check passed.");
}
