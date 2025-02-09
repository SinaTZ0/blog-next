"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SelectUser } from "@/lib/drizzle/schema";

export type User = {
    id: string;
    email: string;
    name: string;
    role: string;
    image?: string;
    banned: boolean;
    createdAt: string;
};

export const columns: ColumnDef<SelectUser>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-4">
                    <Avatar className="h-8 w-8">
                        <AvatarImage
                            src={row.original.image ?? undefined}
                            alt={row.original.name}
                        />
                        <AvatarFallback>
                            {row.original.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span>{row.original.name}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
    },
    {
        accessorKey: "role",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => {
            const role = row.getValue("role") as string;
            return (
                <Badge variant={role === "admin" ? "destructive" : "secondary"}>
                    {role}
                </Badge>
            );
        },
    },
    {
        accessorKey: "banned",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const banned = row.getValue("banned") as boolean;
            return (
                <Badge variant={banned ? "destructive" : "secondary"}>
                    {banned ? "Banned" : "Active"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Joined" />
        ),
        cell: ({ row }) => {
            return new Date(row.getValue("createdAt")).toDateString();
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
