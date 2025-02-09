/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useState } from "react";
import { User } from "./columns";
import { authClient } from "@/lib/better-auth/auth-client";
import { Ellipsis } from "lucide-react";

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const user = row.original as User;
    const [isLoading, setIsLoading] = useState(false);

    const handleBanUser = async () => {
        try {
            setIsLoading(true);
            await authClient.admin.banUser({
                userId: user.id,
            });
            toast.success("User banned successfully");
            // Refresh the page to update the table
            window.location.reload();
        } catch (error) {
            toast.error("Failed to ban user");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnbanUser = async () => {
        try {
            setIsLoading(true);
            await authClient.admin.unbanUser({
                userId: user.id,
            });
            toast.success("User unbanned successfully");
            // Refresh the page to update the table
            window.location.reload();
        } catch (error) {
            toast.error("Failed to unban user");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetRole = async (role: string) => {
        try {
            setIsLoading(true);
            await authClient.admin.setRole({
                userId: user.id,
                role,
            });
            toast.success(`User role updated to ${role}`);
            // Refresh the page to update the table
            window.location.reload();
        } catch (error) {
            toast.error("Failed to update user role");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                    disabled={isLoading}
                >
                    <Ellipsis className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem onClick={() => handleSetRole("admin")}>
                    تبدیل به ادمین
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSetRole("user")}>
                    تبدیل به کاربر
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {user.banned ? (
                    <DropdownMenuItem onClick={handleUnbanUser}>
                        رفع مسدودیت
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem onClick={handleBanUser}>
                        مسدود کردن
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
