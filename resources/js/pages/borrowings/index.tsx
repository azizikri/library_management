import AppLayout from '@/layouts/app-layout';
import { type Borrowing, type Paginated } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { formatDate, formatIDR } from '@/lib/utils';
import Pagination from '@/components/pagination';
import { useBreadcrumbs } from '@/lib/breadcrumbs';

export default function BorrowingsIndex({ borrowings }: { borrowings: Paginated<Borrowing> }) {
    const breadcrumbs = useBreadcrumbs({ title: 'Borrowings', href: '/borrowings' });
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Borrowings" />
            <div className="p-4 space-y-4">
                <div className="flex justify-end"><Link href="/borrowings/create" prefetch><Button>New Borrowing</Button></Link></div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left">
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
