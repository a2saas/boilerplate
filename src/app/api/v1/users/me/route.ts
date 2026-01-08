import { ensureUser } from "@/server/db/ensure-user";
import { success, error, handleApiError } from "@/lib/api";

export async function GET() {
  try {
    const user = await ensureUser();

    if (!user) {
      return error("Unauthorized", 401);
    }

    return success(user);
  } catch (err) {
    return handleApiError(err);
  }
}
