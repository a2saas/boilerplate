import { redirect } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { getConfigStatus } from "@/lib/config-status";

export default function SignUpPage() {
  const config = getConfigStatus();

  if (!config.clerkPublishable) {
    redirect("/setup");
  }

  return <SignUp signInUrl="/sign-in" />;
}
