"use client";
import { authClient } from "@/lib/better-auth/auth-client";
import Link from "next/link";
import React from "react";

const page = () => {
    const session = authClient.useSession();
    if (session.data?.session)
        return (
            <div className="flex flex-col">
                <div>{session.data?.user.name}</div>
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
