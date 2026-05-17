import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { user, session, account, verification } from "@/db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user,
            session,
            account,
            verification
        }
    }),
    user: {
        additionalFields: {
            isAdmin: {
                type: "boolean",
                required: false,
                defaultValue: false
            }
        }
    },
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            // Keep only standard sign-in scopes
            scope: ["email", "profile"], 
            accessType: "offline" as const,
            prompt: "consent" as const,
        },
    },
    advanced: {
        defaultCookieAttributes: {
            sameSite: process.env.NODE_ENV === "production" ? "lax" : "lax",
            secure: process.env.NODE_ENV === "production",
        },
        crossSubDomainCookies: {
            enabled: process.env.NODE_ENV === "production",
        }
    }
});