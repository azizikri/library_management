import AppLayout from '@/layouts/app-layout';
import { Form, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index as booksIndex, create as booksCreate, store as booksStore } from "@/routes/books";
import InputError from '@/components/input-error';
import { useBreadcrumbs } from '@/lib/breadcrumbs';

export default function BooksCreate() {
    const breadcrumbs = useBreadcrumbs(
        { title: 'Books', href: booksIndex() },
        { title: 'Create', href: booksCreate() },
    );
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Book" />
            <Form {...booksStore.form()} disableWhileProcessing className="max-w-3xl space-y-6 p-4">
                {({ processing, errors }) => (
                    <>
                        <input type="hidden" name="_token" value={(document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content ?? ''} />
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" required />
                                <InputError message={errors.title} />
                            </div>
                            <div>
                                <Label htmlFor="author">Author</Label>
                                <Input id="author" name="author" required />
                                <InputError message={errors.author} />
                            </div>
                            <div>
                                <Label htmlFor="isbn">ISBN</Label>
                                <Input id="isbn" name="isbn" required />
                                <InputError message={errors.isbn} />
                            </div>
                            <div>
                                <Label htmlFor="category">Category</Label>
                                <Input id="category" name="category" required />
                                <InputError message={errors.category} />
                            </div>
                            <div>
                                <Label htmlFor="daily_rental_price">Daily Rental Price</Label>
                                <Input id="daily_rental_price" name="daily_rental_price" type="number" step="0.01" min="0" required />
                                <InputError message={errors.daily_rental_price} />
                            </div>
                            <div>
                                <Label htmlFor="stock_quantity">Stock Quantity</Label>
                                <Input id="stock_quantity" name="stock_quantity" type="number" min="0" required />
                                <InputError message={errors.stock_quantity} />
                            </div>
                            <div>
                                <Label htmlFor="available_quantity">Available Quantity</Label>
                                <Input id="available_quantity" name="available_quantity" type="number" min="0" required />
                                <InputError message={errors.available_quantity} />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" name="description" />
                            <InputError message={errors.description} />
                        </div>
                        <Button type="submit" disabled={processing}>Create</Button>
                    </>
                )}
            </Form>
        </AppLayout>
    );
}
