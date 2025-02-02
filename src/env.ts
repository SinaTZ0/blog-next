import { z, ZodError } from "zod";

const envSchema = z.object({
    NODE_ENV: z.string().default("development"),
    DATABASE_URL: z.string(),
    BETTER_AUTH_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
});

type envSchemaT = z.infer<typeof envSchema>;

//define as let so we could access it for export. otherwise it would just accesable inside of try catch
let env: envSchemaT;

try {
    env = envSchema.parse(process.env);
} catch (e) {
    const error = e as ZodError;

    console.error("Invalid env: ");

    console.log(error.flatten().fieldErrors);

    process.exit(1);
}

export default env;
