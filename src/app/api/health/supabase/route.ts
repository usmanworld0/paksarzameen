import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Diagnostic endpoint to check Supabase connectivity and schema.
 * Use at /api/health/supabase to verify healthcare setup.
 */
export async function GET() {
  const checks = {
    supabaseConnection: false,
    tablesExist: {
      users: false,
      user_profile: false,
      healthcare_doctors: false,
      profiles: false,
    },
    errors: [] as string[],
  };

  try {
    const supabase = getSupabaseAdminClient();
    checks.supabaseConnection = true;

    // Check if tables exist
    const tableNames = ["users", "user_profile", "healthcare_doctors", "profiles"];

    for (const tableName of tableNames) {
      try {
        const { data, error, status } = await supabase
          .from(tableName)
          .select("count()", { count: "exact", head: true });

        if (status === 200 || error?.code === "PGRST116") {
          // Table exists (PGRST116 is "not found" in results, meaning table exists)
          checks.tablesExist[tableName as keyof typeof checks.tablesExist] = true;
        } else if (error?.code === "42P01") {
          checks.errors.push(`Table "${tableName}" does not exist (error: ${error.code})`);
        } else if (error) {
          checks.errors.push(`Error querying "${tableName}": ${error.message}`);
        }
      } catch (err) {
        checks.errors.push(`Exception checking "${tableName}": ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    // If tables exist, try a sample query
    if (checks.tablesExist.user_profile) {
      try {
        const { data, error } = await supabase
          .from("user_profile")
          .select("*")
          .limit(1);

        if (error && !error.message.includes("no rows")) {
          checks.errors.push(`Sample query on user_profile failed: ${error.message}`);
        }
      } catch (err) {
        checks.errors.push(`Exception sampling user_profile: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: checks.errors.length === 0 ? "healthy" : "unhealthy",
      checks,
      nextSteps:
        checks.errors.length > 0
          ? "Run docs/database/healthcare_schema_init.sql in Supabase SQL Editor, then docs/database/healthcare_doctors_seed.sql"
          : "All checks passed. Healthcare schema is ready.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        status: "error",
        message: error instanceof Error ? error.message : String(error),
        nextSteps: "Verify SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL environment variables.",
      },
      { status: 500 }
    );
  }
}
