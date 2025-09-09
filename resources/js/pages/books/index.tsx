import AppLayout from '@/layouts/app-layout';
import { type Book, type BookFilters, type Paginated, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatIDR } from '@/lib/utils';
import Pagination from '@/components/pagination';
import { index as booksIndex, destroy as booksDestroy, create as booksCreate } from "@/routes/books";
import { useBreadcrumbs } from '@/lib/breadcrumbs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ConfirmDelete from '@/components/confirm-delete';

export default function BooksIndex({ books, filters }: { books: Paginated<Book>; filters: BookFilters }) {
    const breadcrumbs = useBreadcrumbs({ title: 'Books', href: booksIndex() });
    const { flash } = usePage<SharedData>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Books" />
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
                            <Input id="search" name="search" defaultValue={filters?.search ?? ''} placeholder="Title, author, ISBN" />
                        </div>
                        <div>
                            <Label htmlFor="category">Category</Label>
                            <Input id="category" name="category" defaultValue={filters?.category ?? ''} />
                        </div>
                        <Button type="submit">Filter</Button>
                    </form>
                    <div className="ml-auto">
                        <Link href={booksCreate()} prefetch className="inline-block"><Button>Add Book</Button></Link>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left">
                                <th className="p-2">Title</th>
                                <th className="p-2">Author</th>
                                <th className="p-2">ISBN</th>
                                <th className="p-2">Category</th>
                                <th className="p-2">Price</th>
                                <th className="p-2">Available</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books?.data?.map((b: Book) => (
                                <tr key={b.id} className="border-t">
                                    <td className="p-2">{b.title}</td>
                                    <td className="p-2">{b.author}</td>
                                    <td className="p-2">{b.isbn}</td>
                                    <td className="p-2">{b.category}</td>
                                    <td className="p-2">{formatIDR(b.daily_rental_price)}</td>
                                    <td className="p-2">{b.available_quantity} / {b.stock_quantity}</td>
                                    <td className="p-2">
                                        <Link href={`/books/${b.id}/edit`} prefetch className="mr-2"><Button variant="secondary">Edit</Button></Link>
                                        <ConfirmDelete form={booksDestroy.form.delete(b.id)} entityLabel="book" name={b.title} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination links={books.links} />
            </div>
        </AppLayout>
    );
}
