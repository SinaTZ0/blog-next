import type { BetterAuthPlugin } from "better-auth";
import { db } from "../drizzle/db-connection";
import { userSignupLogs } from "../drizzle/schema";

export const plugin_CookieAge_Log = () => {
    return {
        id: "my-plugin-2",
        hooks: {
            after: [
                {
                    //match all the routes
                    matcher: () => {
                        return true;
                    },
                    handler: async (ctx) => {
                        const cookieHeader = ctx.responseHeader?.get("set-cookie");
                        if (!cookieHeader) return ctx;

                        // Split multiple cookies if present (cookies are separated by comma)
                        const cookies = cookieHeader.split(",").map((cookie) => {
                            // Only modify the better-auth.session_token cookie
                            if (cookie.includes("better-auth.session_token")) {
                                const cookieParts = cookie
                                    .trim()
                                    .split("; ")
                                    .map((part) => {
                                        if (part.startsWith("Max-Age=")) {
                                            return "Max-Age=2147483647";
                                        }
                                        return part;
                                    });
                                return cookieParts.join("; ");
                            }
                            return cookie;
                        });

                        //add loges if better-auth.session_token(in signin or singup process) was sent to client
                        if (cookies) {
                            if (ctx.context.newSession) {
                                const logs = {
                                    token: ctx.context.newSession.session.token,
                                    userId: ctx.context.newSession.session.userId,
                                    userEmail: ctx.context.newSession.user.email,
                                    ipAddress: ctx.context.newSession.session.ipAddress,
                                    userAgent: ctx.context.newSession.session.userAgent,
                                };
                                await db.insert(userSignupLogs).values(logs);
                            }
                        }
                        // Join all cookies back together
                        const modifiedCookieHeader = cookies.join(",");

                        // Set the modified cookies
                        ctx.responseHeader.set("set-cookie", modifiedCookieHeader);

                        return ctx;
                    },
                },
            ],
        },
    } satisfies BetterAuthPlugin;
};
