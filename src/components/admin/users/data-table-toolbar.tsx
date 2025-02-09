"use client";

import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/better-auth/auth-client";
import { toast } from "sonner";
import { useState } from "react";
import { User } from "./columns";
import { Ellipsis } from "lucide-react";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

export function DataTableToolbar<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const [isLoading, setIsLoading] = useState(false);
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedUsers = selectedRows.map((row) => row.original as User);

    const handleBulkAction = async (
        action: "ban" | "unban" | "makeAdmin" | "makeUser"
    ) => {
        setIsLoading(true);
        try {
            const promises = selectedUsers.map((user) => {
                switch (action) {
                    case "ban":
                        return authClient.admin.banUser({ userId: user.id });
                    case "unban":
                        return authClient.admin.unbanUser({ userId: user.id });
                    case "makeAdmin":
                        return authClient.admin.setRole({
                            userId: user.id,
                            role: "admin",
                        });
                    case "makeUser":
                        return authClient.admin.setRole({
                            userId: user.id,
                            role: "user",
                        });
                }
            });

            await Promise.all(promises);
            toast.success(`Bulk action completed successfully`);
            window.location.reload();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Failed to perform bulk action");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-between py-4">
            <Input
                placeholder="Filter emails..."
                value={
                    (table.getColumn("email")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                    table.getColumn("email")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
            />
            <div className="flex items-center gap-2">
                {selectedRows.length > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" disabled={isLoading}>
                                <Ellipsis />
                                <span className="text-gray-400">
                                    ({selectedRows.length})
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => handleBulkAction("makeAdmin")}
                            >
                                Make Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleBulkAction("makeUser")}
                            >
                                Make User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleBulkAction("ban")}
                            >
                                Ban Users
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleBulkAction("unban")}
                            >
                                Unban Users
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">View</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[150px]">
                        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) =>
                                        column.toggleVisibility(!!value)
                                    }
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
