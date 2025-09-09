import AppLayout from '@/layouts/app-layout';
import { type Paginated, type User, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Pagination from '@/components/pagination';
import { useBreadcrumbs } from '@/lib/breadcrumbs';
import { formatDate } from '@/lib/utils';
import { destroy as usersDestroy, create as usersCreate, edit as usersEdit } from "@/routes/users";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ConfirmDelete from '@/components/confirm-delete';

export default function UsersIndex({ users, filters }: { users: Paginated<User>; filters: { search?: string } }) {
    const breadcrumbs = useBreadcrumbs({ title: 'Users', href: '/users' });
    const { flash } = usePage<SharedData>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="p-4 space-y-4">
                {(flash?.success || flash?.error) && (
                    <Alert variant={flash?.error ? 'destructive' : 'default'}>
                        <AlertTitle>{flash?.error ? 'Error' : 'Success'}</AlertTitle>
                        <AlertDescription>{flash?.error || flash?.success}</AlertDescription>
                    </Alert>
                )}
                <div className="flex items-end gap-2">
                    <form className="flex items-end gap-2" method="get">
                        <div>
                            <Label htmlFor="search">Search</Label>
                            <Input id="search" name="search" defaultValue={filters?.search ?? ''} placeholder="Name or email" />
                        </div>
                        <Button type="submit">Filter</Button>
                    </form>
                    <div className="ml-auto">
                        <Link href={usersCreate()} prefetch className="inline-block"><Button>Add User</Button></Link>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left">
                                <th className="p-2">Name</th>
                                <th className="p-2">Email</th>
                                <th className="p-2">Role</th>
                                <th className="p-2">Created</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.data?.map((u: User) => (
                                <tr key={u.id} className="border-t">
                                    <td className="p-2">{u.name}</td>
                                    <td className="p-2">{u.email}</td>
                                    <td className="p-2">{u.role}</td>
                                    <td className="p-2">{u.created_at ? formatDate(u.created_at) : ''}</td>
                                    <td className="p-2">
                                        <Link href={usersEdit(u.id)} prefetch className="mr-2"><Button variant="secondary">Edit</Button></Link>
                                        <ConfirmDelete form={usersDestroy.form.delete(u.id)} entityLabel="user" name={u.email} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination links={users.links} />
            </div>
        </AppLayout>
    );
}
