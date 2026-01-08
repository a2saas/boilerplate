import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

import { siteConfig } from "@/lib/site";

interface WelcomeEmailProps {
  name: string | null;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  const displayName = name ?? "there";

  return (
    <Html>
      <Head />
      <Preview>Welcome to {siteConfig.name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to {siteConfig.name}</Heading>
          <Text style={text}>Hi {displayName},</Text>
          <Text style={text}>
            Thanks for signing up! Your account is ready to go.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={`${siteConfig.url}/dashboard`}>
              Go to Dashboard
            </Button>
          </Section>
          <Text style={text}>
            If you have any questions, just reply to this email — we&apos;re
            here to help.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            <Link href={siteConfig.url} style={link}>
              {siteConfig.name}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  marginBottom: "64px",
  borderRadius: "8px",
};

const h1 = {
  color: "#18181b",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.25",
  marginBottom: "24px",
};

const text = {
  color: "#52525b",
  fontSize: "16px",
  lineHeight: "1.5",
  marginBottom: "16px",
};

const buttonContainer = {
  marginTop: "24px",
  marginBottom: "24px",
};

const button = {
  backgroundColor: "#18181b",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "500",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const hr = {
  borderColor: "#e4e4e7",
  margin: "24px 0",
};

const footer = {
  color: "#a1a1aa",
  fontSize: "14px",
};

const link = {
  color: "#a1a1aa",
  textDecoration: "underline",
};
