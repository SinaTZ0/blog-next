import { z } from "zod";

export const signUpSchema = z
    .object({
        name: z.string().min(1, { message: "نام الزامی است" }),
        email: z.string().email({ message: "آدرس ایمیل نامعتبر است" }),
        password: z
            .string()
            .min(6, { message: "رمز عبور باید حداقل ۶ کاراکتر باشد" }),
        confirmPassword: z
            .string()
            .min(1, { message: "تایید رمز عبور الزامی است" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "رمز عبور و تایید آن باید یکسان باشند",
        path: ["confirmPassword"],
    });

export const signInSchema = z.object({
    email: z.string().email({ message: "آدرس ایمیل نامعتبر است" }),
    password: z
        .string()
        .min(6, { message: "رمز عبور باید حداقل ۶ کاراکتر باشد" }),
});
