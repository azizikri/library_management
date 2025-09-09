import AppLayout from '@/layouts/app-layout';
import { type Borrowing, type Paginated, type ReportFilters, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDate, formatIDR } from '@/lib/utils';
import Pagination from '@/components/pagination';
import { index as reportsIndex, exportMethod as reportsExport } from '@/routes/reports';
import { returning as borrowingReturn } from '@/routes/borrowings';
import { useBreadcrumbs } from '@/lib/breadcrumbs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ConfirmDelete from '@/components/confirm-delete';

export default function ReportsIndex({ borrowings, filters, users = [] as { id: number; name: string }[] }: { borrowings: Paginated<Borrowing>; filters: ReportFilters & { user_id?: number | string }; users?: { id: number; name: string }[] }) {
    const breadcrumbs = useBreadcrumbs({ title: 'Reports', href: reportsIndex() });
    const { auth, flash } = usePage<SharedData>().props;
    const [userId, setUserId] = useState<string>(String(filters?.user_id ?? ''));
    const selectValue = userId === '' ? 'all' : userId;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />
            <div className="p-4 space-y-4">
                {(flash?.success || flash?.error) && (
                    <Alert variant={flash?.error ? 'destructive' : 'default'}>
                        <AlertTitle>{flash?.error ? 'Error' : 'Success'}</AlertTitle>
                        <AlertDescription>{flash?.error || flash?.success}</AlertDescription>
                    </Alert>
                )}

                <form className="flex items-end gap-2" method="get">
                    <div>
                        <Label htmlFor="start_date">Start Date</Label>
                        <Input id="start_date" name="start_date" type="date" defaultValue={filters?.start_date ?? ''} />
                    </div>
                    <div>
                        <Label htmlFor="end_date">End Date</Label>
                        <Input id="end_date" name="end_date" type="date" defaultValue={filters?.end_date ?? ''} />
                    </div>
                    {auth.user?.role === 'admin' && (
                        <div>
                            <Label htmlFor="user_id">User</Label>
                            <input type="hidden" name="user_id" value={userId} />
                            <Select value={selectValue} onValueChange={(v) => setUserId(v === 'all' ? '' : v)}>
                                <SelectTrigger className="w-56">
                                    <SelectValue placeholder="All Users" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Users</SelectItem>
                                    {users.map((u) => (
                                        <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <Button type="submit">Filter</Button>
                </form>

                <div className="flex gap-2">
                    <a href={reportsExport('excel', { query: { start_date: filters?.start_date, end_date: filters?.end_date, user_id: filters?.user_id } }).url}>
                        <Button type="button">Export Excel</Button>
                    </a>
                    <a href={reportsExport('pdf', { query: { start_date: filters?.start_date, end_date: filters?.end_date, user_id: filters?.user_id } }).url}>
                        <Button type="button" variant="secondary">Export PDF</Button>
                    </a>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left">
                                <th className="p-2">User</th>
                                <th className="p-2">Book</th>
                                <th className="p-2">Borrowed</th>
                                <th className="p-2">Return</th>
                                <th className="p-2">Days</th>
                                <th className="p-2">Total</th>
                                <th className="p-2">Status</th>
                                {auth.user?.role === 'admin' && <th className="p-2">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {borrowings?.data?.map((r: Borrowing) => (
                                <tr key={r.id} className="border-t">
                                    <td className="p-2">{r.user?.name}</td>
                                    <td className="p-2">{r.book?.title}</td>
                                    <td className="p-2">{formatDate(r.borrowed_date)}</td>
                                    <td className="p-2">{formatDate(r.return_date)}</td>
                                    <td className="p-2">{r.days_borrowed}</td>
                                    <td className="p-2">{formatIDR(r.total_cost)}</td>
                                    <td className="p-2">{r.status}</td>
                                    {auth.user?.role === 'admin' && r.status !== 'returned' && (
                                        <td className="p-2">
                                            <ConfirmDelete
                                                form={borrowingReturn.form({ borrowing: r.id })}
                                                entityLabel="borrowing"
                                                name={r.book?.title}
                                                triggerLabel="Return"
                                                confirmLabel="Confirm return"
                                                title="Mark as returned?"
                                                description="This will mark the borrowing as returned and restock the book."
                                                triggerVariant="secondary"
                                            />
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination links={borrowings.links} />
            </div>
        </AppLayout>
    );
}
