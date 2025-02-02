import honoApp from "@/server/main";
import { handle } from "hono/vercel";

export const GET = handle(honoApp);
export const POST = handle(honoApp);
