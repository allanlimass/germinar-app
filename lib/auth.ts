import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema/auth";
import { organization } from "better-auth/plugins";
import { resend } from "./resend";
import { OrganizationInvitationEmail } from "@/components/emails/organization-invitation";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  user: {
    additionalFields: {
      lastActiveBranchId: {
        type: "string",
        required: false,
      },
    },
  },
  organization: {
    enabled: true,
  },
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data) {
      await resend.emails.send({
        from: "",
        to: data.user.email,
        subject: "Recuperação de senha",
        html: "",
      });
    },
  },
  plugins: [
    organization({
      async sendInvitationEmail(data) {
        const inviteLink = `${process.env.BETTER_AUTH_URL}/accept-invitation/${data.id}`;
        resend.emails.send({
          from: "onboarding@resend.dev",
          to: data.email,
          subject: "Convite para organização",
          react: OrganizationInvitationEmail({
            email: data.email,
            organizationName: data.organization.name,
            invitedByUsername: data.inviter.user.name,
            invitedByEmail: data.inviter.user.email,
            inviteFromIp: "",
            inviteFromLocation: "",
            inviteLink,
          }),
        });
      },
    }),
  ],
});
