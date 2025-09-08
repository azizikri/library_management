import AppLayout from '@/layouts/app-layout';
import { type Borrowing, type Paginated, type ReportFilters } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDate, formatIDR } from '@/lib/utils';
import Pagination from '@/components/pagination';
import { index as reportsIndex } from '@/routes/reports';
import { useBreadcrumbs } from '@/lib/breadcrumbs';

export default function ReportsIndex({ borrowings, filters }: { borrowings: Paginated<Borrowing>; filters: ReportFilters }) {
    const breadcrumbs = useBreadcrumbs({ title: 'Reports', href: reportsIndex() });
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />
            <div className="p-4 space-y-4">
                <form className="flex items-end gap-2" method="get">
                    <div>
                        <Label htmlFor="start_date">Start Date</Label>
                        <Input id="start_date" name="start_date" type="date" defaultValue={filters?.start_date ?? ''} />
                    </div>
                    <div>
                        <Label htmlFor="end_date">End Date</Label>
                        <Input id="end_date" name="end_date" type="date" defaultValue={filters?.end_date ?? ''} />
                    </div>
                    <Button type="submit">Filter</Button>
                </form>

                <div className="flex gap-2">
                    <a href={`/reports/export/excel?start_date=${filters?.start_date ?? ''}&end_date=${filters?.end_date ?? ''}`}>
                        <Button type="button">Export Excel</Button>
                    </a>
                    <a href={`/reports/export/pdf?start_date=${filters?.start_date ?? ''}&end_date=${filters?.end_date ?? ''}`}>
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
