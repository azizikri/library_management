import AppLayout from '@/layouts/app-layout';
import { type Borrowing, type Paginated, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { formatDate, formatIDR } from '@/lib/utils';
import Pagination from '@/components/pagination';
import { useBreadcrumbs } from '@/lib/breadcrumbs';
import { create as borrowingsCreate } from '@/routes/borrowings';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export default function BorrowingsIndex({ borrowings, overdue_count = 0 }: { borrowings: Paginated<Borrowing>; overdue_count?: number }) {
    const breadcrumbs = useBreadcrumbs({ title: 'Borrowings', href: '/borrowings' });
    const { flash } = usePage<SharedData>().props;
    const blocked = (overdue_count ?? 0) >= 2;
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
                {overdue_count > 0 && (
                    <Alert variant={blocked ? 'destructive' : 'default'}>
                        <AlertTitle>{blocked ? 'Peminjaman Diblokir' : 'Perhatian'}</AlertTitle>
                        <AlertDescription>
                            {blocked
                                ? 'Anda memiliki 2 atau lebih peminjaman yang terlambat. Kembalikan buku yang terlambat terlebih dahulu sebelum meminjam lagi.'
                                : `Anda memiliki ${overdue_count} peminjaman terlambat. Mohon segera kembalikan.`}
                        </AlertDescription>
                    </Alert>
                )}
                <div className="flex justify-end">
                    <Link href={blocked ? '#' : borrowingsCreate()} prefetch>
                        <Button disabled={blocked}>New Borrowing</Button>
                    </Link>
                </div>
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
                            {borrowings?.data?.map((r: Borrowing) => {
                                const { id, book, borrowed_date, return_date, days_borrowed, total_cost, status } = r;
                                const rowClass = [
                                    'border-t',
                                    status === 'overdue' ? 'bg-red-50/40 dark:bg-red-950/20' : '',
                                    status === 'returned' ? 'bg-green-50/40 dark:bg-green-950/20' : '',
                                ].filter(Boolean).join(' ');

                                const daysLeft = Math.ceil((new Date(return_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                                const statusBadge =
                                    status === 'overdue' ? (
                                        <Badge variant="destructive">Overdue</Badge>
                                    ) : status === 'returned' ? (
                                        <Badge
                                            variant="success"
                                        >
                                            Returned
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="capitalize">
                                            {status}
                                        </Badge>
                                    );

                                return (
                                    <tr key={id} className={rowClass}>
                                        <td className="p-2">{book?.title}</td>
                                        <td className="p-2">{formatDate(borrowed_date)}</td>
                                        <td className="p-2">{formatDate(return_date)}</td>
                                        <td className="p-2">{days_borrowed}</td>
                                        <td className="p-2">{formatIDR(total_cost)}</td>
                                        <td className="p-2">
                                            <div className="flex items-center gap-2">
                                                {statusBadge}
                                                {status === 'active' && daysLeft >= 0 && daysLeft <= 7 && (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800/40 dark:bg-amber-950/30 dark:text-amber-200"
                                                    >
                                                        Due in {daysLeft} day{daysLeft === 1 ? '' : 's'}
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <Pagination links={borrowings.links} />
            </div>
        </AppLayout>
    );
}
