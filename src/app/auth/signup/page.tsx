"use client";
import { authClient } from "@/lib/better-auth/auth-client"; //import the auth client
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const signUp = async () => {
        const { data, error } = await authClient.signUp.email(
            {
                email,
                password,
                name,
            },
            {
                onRequest: (ctx) => {
                    //show loading
                },
                onSuccess: (ctx) => {
                    // router.push("/auth/secret");
                },
                onError: (ctx) => {
                    alert(ctx.error.message);
                },
            }
        );
    };
    const signOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/auth/secret"); // redirect to login page
                },
            },
        });
    };
    return (
        <>
            <div>
                <div className="my-4 flex gap-2">
                    <label>name</label>
                    <input type="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="my-4 flex gap-2">
                    <label>password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="my-4 flex gap-2">
                    <label>email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <button className="block my-4" onClick={signUp}>
                    Sign Up
                </button>
                <button className="block" onClick={signOut}>
                    sign Out
                </button>
                <Link href={"/auth/secret"}>Secret</Link>
            </div>
        </>
    );
}
