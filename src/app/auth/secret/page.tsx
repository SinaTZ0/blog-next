import { auth } from "@/lib/better-auth/auth"; // path to your Better Auth server instance
import { headers } from "next/headers";
import Link from "next/link";
import React from "react";

const page = async () => {
    const session = await auth.api.getSession({
        headers: await headers(), // you need to pass the headers object.
    });
    if (session)
        return (
            <div className="flex flex-col">
                <div>{session.user.name}</div>
                <Link href={"/auth/signup"} className="text-blue-500">
                    signup
                </Link>
                <Link href={"/auth/signin"} className="text-blue-500">
                    signin
                </Link>
            </div>
        );
    return (
        <>
            <div className="flex flex-col">
                <div>UnAthurized</div>
                <Link href={"/auth/signup"} className="text-blue-500">
                    signup
                </Link>
                <Link href={"/auth/signin"} className="text-blue-500">
                    signin
                </Link>
            </div>
        </>
    );
};

export default page;
