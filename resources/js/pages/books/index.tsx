import AppLayout from '@/layouts/app-layout';
import { type Book, type BookFilters, type Paginated } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatIDR } from '@/lib/utils';
import Pagination from '@/components/pagination';
import { index as booksIndex, destroy as booksDestroy } from "@/routes/books";
import { useBreadcrumbs } from '@/lib/breadcrumbs';

export default function BooksIndex({ books, filters }: { books: Paginated<Book>; filters: BookFilters }) {
    const breadcrumbs = useBreadcrumbs({ title: 'Books', href: booksIndex() });
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Books" />
            <div className="p-4 space-y-4">
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
                        <Link href="/books/create" prefetch className="inline-block"><Button>Add Book</Button></Link>
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
                                        <form method="post" action={booksDestroy.form.delete(b.id).action} className="inline">
                                            <input type="hidden" name="_token" value={(document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content ?? ''} />
                                            <Button variant="destructive" type="submit">Delete</Button>
                                        </form>
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
