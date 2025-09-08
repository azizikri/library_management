import AppLayout from '@/layouts/app-layout';
import { type Paginated, type User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Pagination from '@/components/pagination';
import { useBreadcrumbs } from '@/lib/breadcrumbs';
import { formatDate } from '@/lib/utils';

export default function UsersIndex({ users, filters }: { users: Paginated<User>; filters: { search?: string } }) {
    const breadcrumbs = useBreadcrumbs({ title: 'Users', href: '/users' });
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="p-4 space-y-4">
                <div className="flex items-end gap-2">
                    <form className="flex items-end gap-2" method="get">
                        <div>
                            <Label htmlFor="search">Search</Label>
                            <Input id="search" name="search" defaultValue={filters?.search ?? ''} placeholder="Name or email" />
                        </div>
                        <Button type="submit">Filter</Button>
                    </form>
                    <div className="ml-auto">
                        <Link href="/users/create" prefetch className="inline-block"><Button>Add User</Button></Link>
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
                                        <Link href={`/users/${u.id}/edit`} prefetch className="mr-2"><Button variant="secondary">Edit</Button></Link>
                                        <form method="post" action={`/users/${u.id}`} className="inline" onSubmit={(e) => { if (!confirm('Delete this user?')) e.preventDefault(); }}>
                                            <input type="hidden" name="_method" value="DELETE" />
                                            <input type="hidden" name="_token" value={(document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content ?? ''} />
                                            <Button variant="destructive" type="submit">Delete</Button>
                                        </form>
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
