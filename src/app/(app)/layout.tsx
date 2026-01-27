import { redirect } from "next/navigation";
import { ensureUser } from "@/server/db/ensure-user";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { AuthProvider } from "@/components/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await ensureUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        {/* Desktop Sidebar */}
        <Sidebar className="fixed inset-y-0 left-0 z-50 hidden w-64 md:flex" />

        {/* Main content area */}
        <div className="md:pl-64">
          {/* Header */}
          <Header
            user={{
              name: user.name,
              email: user.email,
              imageUrl: user.imageUrl,
            }}
          />

          {/* Page content */}
          <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
