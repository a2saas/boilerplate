import { redirect } from "next/navigation";
import { SignIn } from "@clerk/nextjs";
import { getConfigStatus } from "@/lib/config-status";

export default function SignInPage() {
  const config = getConfigStatus();

  if (!config.clerkPublishable) {
    redirect("/setup");
  }

  return <SignIn signUpUrl="/sign-up" />;
}
