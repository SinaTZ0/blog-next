"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/better-auth/auth-client";
import { useMutation } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";

export function GoogleSignInButton() {
    const { toast } = useToast();

    const googleSignInMutation = useMutation({
        mutationFn: async () => {
            const { data, error } = await authClient.signIn.social({
                provider: "google",
            });
            if (!data) throw error;
            return data;
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "خطا",
                description: error.message,
            });
        },
    });

    return (
        <div>
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        یا
                    </span>
                </div>
            </div>
            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => googleSignInMutation.mutate()}
                disabled={googleSignInMutation.isPending}
            >
                <svg
                    className={`ml-2 h-4 w-4 ${
                        googleSignInMutation.isPending ? "animate-spin" : ""
                    }`}
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="google"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488 512"
                >
                    <path
                        fill="currentColor"
                        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                    ></path>
                </svg>
                {googleSignInMutation.isPending
                    ? "در حال ورود..."
                    : "ورود با گوگل"}
            </Button>
        </div>
    );
}
