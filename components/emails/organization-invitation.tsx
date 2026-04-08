import {
  Html,
  Button,
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Img,
  Link,
  pixelBasedPreset,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface OrganizationInvitationEmailProps {
  email: string;
  organizationName: string;
  invitedByUsername: string;
  invitedByEmail: string;
  teamName?: string;
  inviteLink: string;
  inviteFromIp?: string;
  inviteFromLocation?: string;
}

export function OrganizationInvitationEmail({
  email,
  organizationName,
  invitedByUsername,
  invitedByEmail,
  inviteLink,
  inviteFromIp,
  inviteFromLocation,
}: OrganizationInvitationEmailProps) {
  const previewText = `${invitedByUsername} convidou você para a organização ${organizationName}`;
  const baseUrl = process.env.BETTER_AUTH_URL;
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
        }}
      >
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Preview>{previewText}</Preview>
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/static/vercel-logo.png`}
                width="40"
                height="37"
                alt="Vercel Logo"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Junte-se a <strong>{organizationName}</strong> no{" "}
              <strong>Germinar</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Olá {email},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>{invitedByUsername}</strong> (
              <Link
                href={`mailto:${invitedByEmail}`}
                className="text-blue-600 no-underline"
              >
                {invitedByEmail}
              </Link>
              ) convidou você para a organização{" "}
              <strong>{organizationName}</strong> no <strong>Germinar</strong>.
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={inviteLink}
              >
                Aceitar convite
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              ou copie e cole este URL no seu navegador:{" "}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              Este convite foi enviado para{" "}
              <span className="text-black">{email}</span>. Este convite foi
              enviado de <span className="text-black">{inviteFromIp}</span>{" "}
              localizado em{" "}
              <span className="text-black">{inviteFromLocation}</span>. Se você
              não estava esperando este convite, pode ignorar este email. Se
              você estiver preocupado com a segurança da sua conta, por favor
              responda a este email para entrar em contato conosco.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
