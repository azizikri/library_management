import AppLayout from '@/layouts/app-layout';
import { type Borrowing, type Paginated, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { formatDate, formatIDR } from '@/lib/utils';
import Pagination from '@/components/pagination';
import { useBreadcrumbs } from '@/lib/breadcrumbs';
import { create as borrowingsCreate } from '@/routes/borrowings';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function BorrowingsIndex({ borrowings }: { borrowings: Paginated<Borrowing> }) {
    const breadcrumbs = useBreadcrumbs({ title: 'Borrowings', href: '/borrowings' });
    const { flash } = usePage<SharedData>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Borrowings" />
            <div className="p-4 space-y-4">
                {(flash?.success || flash?.error) && (
                    <Alert variant={flash?.error ? 'destructive' : 'default'}>
                        <AlertTitle>{flash?.error ? 'Error' : 'Success'}</AlertTitle>
                        <AlertDescription>{flash?.error || flash?.success}</AlertDescription>
                    </Alert>
                )}
                <div className="flex justify-end"><Link href={borrowingsCreate()} prefetch><Button>New Borrowing</Button></Link></div>
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
