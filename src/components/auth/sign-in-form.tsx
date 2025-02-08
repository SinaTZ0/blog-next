"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { signInSchema } from "@/schema/auth-schema";
import { authClient } from "@/lib/better-auth/auth-client";
import { GoogleSignInButton } from "./google-sign-in-button";

type SignInData = z.infer<typeof signInSchema>;

export function SignInForm() {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<SignInData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const signInMutation = useMutation({
        mutationFn: async (values: SignInData) => {
            const { data, error } = await authClient.signIn.email({
                email: values.email,
                password: values.password,
            });
            if (data) return data;
            throw error;
        },
        onSuccess: () => {
            toast({
                title: "ورود موفق",
                description: "در حال انتقال به داشبورد...",
            });
            router.push("/auth/secret");
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "خطا",
                description: error.message,
            });
        },
    });

    function onSubmit(values: SignInData) {
        signInMutation.mutate(values);
    }

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                    dir="rtl"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ایمیل</FormLabel>
                                <FormControl>
                                    <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>رمز عبور</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={signInMutation.isPending}
                    >
                        {signInMutation.isPending ? "در حال ورود..." : "ورود"}
                    </Button>
                </form>
            </Form>
            <GoogleSignInButton />
        </>
    );
}
