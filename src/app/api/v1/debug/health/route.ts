import { success } from "@/lib/api";
import {
  getConfigStatus,
  testDbConnection,
  type ConfigStatus,
  type DbConnectionResult,
} from "@/lib/config-status";

type HealthStatus = "healthy" | "degraded" | "unhealthy";

type HealthResponse = {
  status: HealthStatus;
  timestamp: string;
  env: ConfigStatus;
  services: {
    database: DbConnectionResult;
  };
};

function determineStatus(
  env: ConfigStatus,
  dbResult: DbConnectionResult
): HealthStatus {
  const requiredEnvVars = [
    env.database,
    env.clerk,
    env.stripe,
    env.resend,
    env.clerkPublishable,
    env.appUrl,
  ];

  const allRequiredPresent = requiredEnvVars.every(Boolean);
  const dbConnected = dbResult.connected;

  if (allRequiredPresent && dbConnected) {
    return "healthy";
  }

  if (dbConnected && env.database && env.clerk) {
    return "degraded";
  }

  return "unhealthy";
}

export async function GET() {
  const env = getConfigStatus();
  const dbResult = await testDbConnection();

  const response: HealthResponse = {
    status: determineStatus(env, dbResult),
    timestamp: new Date().toISOString(),
    env,
    services: {
      database: dbResult,
    },
  };

  return success(response);
}
