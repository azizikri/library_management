import AppLayout from '@/layouts/app-layout';
import { type Book } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { useEffect, useState } from 'react';
import { formatIDR } from '@/lib/utils';
import { useBreadcrumbs } from '@/lib/breadcrumbs';
import { index as borrowingsIndex, create as borrowingsCreate, store as borrowingsStore } from "@/routes/borrowings";

export default function BorrowingsCreate({ books }: { books: Book[] }) {
    const breadcrumbs = useBreadcrumbs(
        { title: 'Borrowings', href: borrowingsIndex() },
        { title: 'Create', href: borrowingsCreate() },
    );
    const [bookId, setBookId] = useState<number | string>(books?.[0]?.id ?? '');
    const [days, setDays] = useState<number>(1);
    const [total, setTotal] = useState<number | null>(null);

    useEffect(() => {
        const fetchCost = async () => {
            if (!bookId || !days) return;
            try {
                const token = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content;
                const res = await fetch('/calculate-cost', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', ...(token ? { 'X-CSRF-TOKEN': token } : {}) },
                    body: JSON.stringify({ book_id: bookId, days: Number(days) }),
                    credentials: 'include',
                });
                if (res.ok) {
                    const j = await res.json();
                    setTotal(j.total_cost);
                }
            } catch (err) {
                console.error('Failed to fetch cost', err);
            }
        };
        fetchCost();
    }, [bookId, days]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Borrowing" />
            <Form {...borrowingsStore.form()} disableWhileProcessing className="max-w-xl space-y-6 p-4">
                {({ processing, errors }) => (
                    <>
                        <input type="hidden" name="_token" value={(document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content ?? ''} />
                        <div>
                            <Label htmlFor="book_id">Book</Label>
                            <select
                                id="book_id"
                                name="book_id"
                                className="w-full rounded-md border px-3 py-2"
                                value={bookId}
                                onChange={(e) => setBookId(e.target.value)}
                            >
                                {books?.map((b: Book) => (
                                    <option key={b.id} value={b.id}>
                                        {b.title} — {b.author} (Avail: {b.available_quantity})
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.book_id} />
                        </div>
                        <div>
                            <Label htmlFor="days_borrowed">Days</Label>
                            <Input
                                id="days_borrowed"
                                name="days_borrowed"
                                type="number"
                                min={1}
                                max={365}
                                value={days}
                                onChange={(e) => setDays(Number(e.target.value))}
                            />
                            <InputError message={errors.days_borrowed} />
                        </div>
                        <div className="text-sm">{total !== null ? `Perkiraan total: ${formatIDR(total)}` : '—'}</div>
                        <Button type="submit" disabled={processing}>Borrow</Button>
                    </>
                )}
            </Form>
        </AppLayout>
    );
}
