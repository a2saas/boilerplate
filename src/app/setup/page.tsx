import { currentUser } from "@clerk/nextjs/server";
import { getConfigStatus, testDbConnection } from "@/lib/config-status";
import { SetupContent } from "@/components/setup/setup-content";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function SetupPage() {
  const config = getConfigStatus();
  const dbResult = await testDbConnection();

  // Check if user is authenticated (without requiring it)
  let user = null;
  try {
    const clerkUser = await currentUser();
    if (clerkUser) {
      user = {
        name:
          [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
          null,
        email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
        imageUrl: clerkUser.imageUrl,
      };
    }
  } catch {
    // User not authenticated, that's fine
  }

  // If authenticated, show with dashboard layout
  if (user) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        {/* Desktop Sidebar */}
        <Sidebar className="fixed inset-y-0 left-0 z-50 hidden w-64 md:flex" />

        {/* Main content area */}
        <div className="md:pl-64">
          {/* Header */}
          <Header user={user} />

          {/* Page content */}
          <main className="mx-auto max-w-2xl px-4 py-8">
            <SetupContent config={config} dbResult={dbResult} />
          </main>
        </div>
      </div>
    );
  }

  // If not authenticated, show minimal layout
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-black">
      <div className="mx-auto max-w-2xl">
        <SetupContent config={config} dbResult={dbResult} />
      </div>
    </div>
  );
}
