import AppLayout from '@/layouts/app-layout';
import { type Book } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { index as booksIndex, edit as booksEdit, update as booksUpdate } from "@/routes/books"
import { useBreadcrumbs } from '@/lib/breadcrumbs';

export default function BooksEdit({ book }: { book: Book }) {
    const breadcrumbs = useBreadcrumbs(
        { title: 'Books', href: booksIndex().url },
        { title: 'Edit', href: booksEdit(book.id).url },
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Book" />
            <Form {...booksUpdate.form.put(book.id)} disableWhileProcessing className="max-w-3xl space-y-6 p-4">
                {({ processing, errors }) => (
                    <>
                        <input type="hidden" name="_token" value={(document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content ?? ''} />
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" defaultValue={book.title} required />
                                <InputError message={errors.title} />
                            </div>
                            <div>
                                <Label htmlFor="author">Author</Label>
                                <Input id="author" name="author" defaultValue={book.author} required />
                                <InputError message={errors.author} />
                            </div>
                            <div>
                                <Label htmlFor="isbn">ISBN</Label>
                                <Input id="isbn" name="isbn" defaultValue={book.isbn} required />
                                <InputError message={errors.isbn} />
                            </div>
                            <div>
                                <Label htmlFor="category">Category</Label>
                                <Input id="category" name="category" defaultValue={book.category} required />
                                <InputError message={errors.category} />
                            </div>
                            <div>
                                <Label htmlFor="daily_rental_price">Daily Rental Price</Label>
                                <Input id="daily_rental_price" name="daily_rental_price" type="number" step="0.01" min="0" defaultValue={book.daily_rental_price} required />
                                <InputError message={errors.daily_rental_price} />
                            </div>
                            <div>
                                <Label htmlFor="stock_quantity">Stock Quantity</Label>
                                <Input id="stock_quantity" name="stock_quantity" type="number" min="0" defaultValue={book.stock_quantity} required />
                                <InputError message={errors.stock_quantity} />
                            </div>
                            <div>
                                <Label htmlFor="available_quantity">Available Quantity</Label>
                                <Input id="available_quantity" name="available_quantity" type="number" min="0" defaultValue={book.available_quantity} required />
                                <InputError message={errors.available_quantity} />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" name="description" defaultValue={book.description ?? ''} />
                            <InputError message={errors.description} />
                        </div>
                        <Button type="submit" disabled={processing}>Save</Button>
                    </>
                )}
            </Form>
        </AppLayout>
    );
}
