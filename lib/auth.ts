import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema/auth";
import { organization } from "better-auth/plugins";
import { ac, roles } from "@/lib/permissions";
import { resend } from "./resend";
import { OrganizationInvitationEmail } from "@/components/emails/organization-invitation";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data, request) {
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
      ac,
      roles: {
        ...roles,
      },
      schema: {
        organization: {
          additionalFields: {
            type: {
              type: "string",
              values: ["headquarters", "regional", "local"],
              input: true,
              required: true,
            },
            path: {
              type: "string",
              input: true,
              required: false,
            },
            cnpj: {
              type: "string",
              input: true,
              required: false,
            },
            email: {
              type: "string",
              input: true,
              required: false,
            },
            phone: {
              type: "string",
              input: true,
              required: false,
            },
            street: {
              type: "string",
              input: true,
              required: false,
            },
            number: {
              type: "string",
              input: true,
              required: false,
            },
            complement: {
              type: "string",
              input: true,
              required: false,
            },
            neighborhood: {
              type: "string",
              input: true,
              required: false,
            },
            city: {
              type: "string",
              input: true,
              required: false,
            },
            state: {
              type: "string",
              input: true,
              required: false,
            },
            zipCode: {
              type: "string",
              input: true,
              required: false,
            },
          },
        },
      },
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
