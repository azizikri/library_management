import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type DashboardMetrics, type TopBook, type Borrowing } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatIDR } from '@/lib/utils';
import { useBreadcrumbs } from '@/lib/breadcrumbs';

export default function Dashboard({ metrics, top_books, recent }: { metrics: DashboardMetrics; top_books: TopBook[]; recent: Borrowing[] }) {
    const breadcrumbs = useBreadcrumbs({ title: 'Dashboard', href: dashboard().url });
    const cards = [
        { label: 'Total Books', value: metrics?.total_books ?? 0 },
        { label: 'Total Copies', value: metrics?.total_copies ?? 0 },
        { label: 'Available Copies', value: metrics?.available_copies ?? 0 },
        { label: 'Active Borrowings', value: metrics?.active_borrowings ?? 0 },
        { label: 'Overdue', value: metrics?.overdue_borrowings ?? 0 },
        { label: 'Revenue (30d)', value: formatIDR(metrics?.revenue_30d ?? 0) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                    {cards.map((c) => (
                        <Card key={c.label}>
                            <CardHeader className="pb-0">
                                <CardTitle className="text-sm text-muted-foreground">{c.label}</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 text-2xl font-semibold">{c.value}</CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-12">
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Top Books</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {(top_books ?? []).map((t: TopBook) => (
                                    <div key={t.title} className="flex items-center justify-between text-sm">
                                        <div className="truncate pr-4">{t.title}</div>
                                        <div className="font-medium">{t.count}</div>
                                    </div>
                                ))}
                                {(!top_books || top_books.length === 0) && (
                                    <div className="text-sm text-muted-foreground">No data yet.</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-9">
                        <CardHeader>
                            <CardTitle>Recent Borrowings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="text-left">
                                            <th className="p-2">User</th>
                                            <th className="p-2">Book</th>
                                            <th className="p-2">Borrowed</th>
                                            <th className="p-2">Return</th>
                                            <th className="p-2">Total</th>
                                            <th className="p-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(recent ?? []).map((r: Borrowing) => (
                                            <tr key={r.id} className="border-t">
                                                <td className="p-2">{r.user?.name}</td>
                                                <td className="p-2">{r.book?.title}</td>
                                                <td className="p-2">{formatDate(r.borrowed_date)}</td>
                                                <td className="p-2">{formatDate(r.return_date)}</td>
                                                <td className="p-2">{formatIDR(r.total_cost)}</td>
                                                <td className="p-2">{r.status}</td>
                                            </tr>
                                        ))}
                                        {(!recent || recent.length === 0) && (
                                            <tr>
                                                <td className="p-2 text-muted-foreground" colSpan={6}>No recent borrowings.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
