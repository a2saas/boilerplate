import { AuthProvider } from "@/components/auth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
        <main className="flex flex-1 items-center justify-center px-4 pb-16">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
