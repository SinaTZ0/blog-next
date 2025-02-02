import { auth } from "@/lib/better-auth/auth";
import { Hono } from "hono";

export const runtime = "edge";

const honoApp = new Hono()
    .basePath("/api")
    .get("/hello", (c) => {
        return c.json({
            message: "Hello Next.js!",
        });
    })
    .on(["POST", "GET"], "/auth/**", (c) => {
        return auth.handler(c.req.raw);
    });

export default honoApp;
