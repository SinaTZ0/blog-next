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
import { signUpSchema } from "@/schema/auth-schema";
import { authClient } from "@/lib/better-auth/auth-client";
import { GoogleSignInButton } from "./google-sign-in-button";

type SignUpData = z.infer<typeof signUpSchema>;

export function SignUpForm() {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<SignUpData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const signUpMutation = useMutation({
        mutationFn: async (values: SignUpData) => {
            const { data, error } = await authClient.signUp.email({
                email: values.email,
                password: values.password,
                name: values.name,
                lang: "en",
            });
            if (data) return data;
            throw error;
        },
        onSuccess: (data) => {
            toast({
                title: `سلام ${data?.user.name}. حساب کاربری شما با موفقیت ایجاد شد`,
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

    function onSubmit(values: SignUpData) {
        signUpMutation.mutate(values);
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
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>نام</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>تایید رمز عبور</FormLabel>
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
                        disabled={signUpMutation.isPending}
                    >
                        {signUpMutation.isPending
                            ? "در حال ثبت‌نام..."
                            : "ثبت‌نام"}
                    </Button>
                </form>
            </Form>
            <GoogleSignInButton />
        </>
    );
}
