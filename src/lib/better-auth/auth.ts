import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/drizzle/db-connection"; // your drizzle instance
import env from "@/env";
import { createClient } from "redis";
import { plugin_CookieAge_Log } from "./plugin-cookieAge-log";

const redis = await createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
    }),
    plugins: [plugin_CookieAge_Log()],
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            mapProfileToUser: (profile) => {
                return {
                    name: profile.given_name + profile.family_name,
                    email: profile.email,
                };
            },
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
            },
        },
    },
    secondaryStorage: {
        get: async (key) => {
            const value = await redis.get(key);
            return value ? value : null;
        },
        set: async (key, value, ttl) => {
            if (ttl) await redis.set(key, value, { EX: ttl });
            // or for ioredis:
            // if (ttl) await redis.set(key, value, 'EX', ttl)
            else await redis.set(key, value);
        },
        delete: async (key) => {
            await redis.del(key);
        },
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 5, // 1 day (every 1 day the session expiration is updated)
    },
});
