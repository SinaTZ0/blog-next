"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { SignInForm } from "./sign-in-form";
import { SignUpForm } from "./sign-up-form";

export function AuthTabs() {
    return (
        <Card className="w-full max-w-md mx-auto" dir="rtl">
            <CardHeader>
                <CardTitle className="text-2xl text-center">
                    حساب کاربری
                </CardTitle>
                <CardDescription className="text-center">
                    برای ادامه وارد شوید یا ثبت‌نام کنید
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="signin" className="w-full ">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signin">ورود</TabsTrigger>
                        <TabsTrigger value="signup">ثبت‌نام</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signin">
                        <SignInForm />
                    </TabsContent>
                    <TabsContent value="signup">
                        <SignUpForm />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
