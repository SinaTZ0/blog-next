import { DataTable } from "@/components/admin/users/data-table";
import { columns } from "@/components/admin/users/columns";
import { db } from "@/lib/drizzle/db-connection";

export default async function UsersPage() {
    const usersData = await db.query.user.findMany({ limit: 10 });

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={usersData} />
        </div>
    );
}
