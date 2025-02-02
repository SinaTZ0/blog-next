import { Hono } from "hono";

export const runtime = "edge";

const honoApp = new Hono().basePath("/api");

honoApp.get("/hello", (c) => {
    return c.json({
        message: "Hello Next.js!",
    });
});

export default honoApp;
