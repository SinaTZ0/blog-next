"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

import { authClient } from "@/lib/better-auth/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Update the sign up schema to include password confirmation
const signUpSchema = z
    .object({
        name: z.string().min(1, { message: "نام الزامی است" }),
        email: z.string().email({ message: "آدرس ایمیل نامعتبر است" }),
        password: z.string().min(6, { message: "رمز عبور باید حداقل ۶ کاراکتر باشد" }),
        confirmPassword: z.string().min(1, { message: "تایید رمز عبور الزامی است" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "رمز عبور و تایید آن باید یکسان باشند",
        path: ["confirmPassword"],
    });

type SignUpData = z.infer<typeof signUpSchema>;

export default function SignUp() {
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

    // Fix the mutation type definition
    const signUpMutation = useMutation({
        mutationFn: async (values: SignUpData) => {
            const { data } = await authClient.signUp.email({
                email: values.email,
                password: values.password,
                name: values.name,
            });
            return data;
        },
        onSuccess: () => {
            toast({
                title: "حساب کاربری با موفقیت ایجاد شد",
                description: "در حال انتقال به داشبورد...",
            });
            router.push("/auth/secret");
        },
        onError: (error: Error) => {
            toast({
                variant: "destructive",
                title: "خطا",
                description: error.message,
            });
        },
    });

    const onSubmit = (data: SignUpData) => {
        signUpMutation.mutate(data);
    };

    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center" dir="rtl">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <h1 className="text-2xl font-semibold text-center">ایجاد حساب کاربری</h1>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>نام</FormLabel>
                                        <FormControl>
                                            <Input placeholder="نام خود را وارد کنید" {...field} />
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
                                            <Input type="email" placeholder="ایمیل خود را وارد کنید" {...field} />
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
                                            <Input type="password" placeholder="رمز عبور خود را وارد کنید" {...field} />
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
                                            <Input type="password" placeholder="رمز عبور خود را مجدداً وارد کنید" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={signUpMutation.isPending}>
                                {signUpMutation.isPending ? "در حال ایجاد حساب..." : "ثبت نام"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <div className="text-sm text-muted-foreground text-center">
                        قبلاً حساب کاربری دارید؟{" "}
                        <Link href="/auth/signin" className="text-primary hover:underline">
                            ورود
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
