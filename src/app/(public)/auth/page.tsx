import { AuthTabs } from "@/components/auth/auth-tabs";

export default function AuthPage() {
    return (
        <div className="container mx-auto flex items-center justify-center min-h-screen py-8 px-4">
            <div className="h-[41.25rem] w-full">
                <AuthTabs />
            </div>
        </div>
    );
}
