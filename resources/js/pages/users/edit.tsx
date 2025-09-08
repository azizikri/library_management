import AppLayout from '@/layouts/app-layout';
import { type User } from '@/types';
import { Head, Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { index as usersIndex, edit as usersEdit, update as usersUpdate } from "@/routes/users"
import { useBreadcrumbs } from '@/lib/breadcrumbs';

export default function UsersEdit({ user }: { user: User }) {
    const breadcrumbs = useBreadcrumbs(
        { title: 'Users', href: usersIndex() },
        { title: 'Edit', href: usersEdit(user.id) },
    );
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />
            <Form {...usersUpdate.form.put(user.id)} disableWhileProcessing className="max-w-3xl space-y-6 p-4">
                {({ processing, errors }) => (
                    <>
                        <input type="hidden" name="_token" value={(document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content ?? ''} />
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" defaultValue={user.name} required />
                                <InputError message={errors.name} />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" defaultValue={user.email} required />
                                <InputError message={errors.email} />
                            </div>
                            <div>
                                <Label htmlFor="password">Password (leave blank to keep)</Label>
                                <Input id="password" name="password" type="password" />
                                <InputError message={errors.password} />
                            </div>
                        </div>
                        <Button disabled={processing} type="submit">Save</Button>
                    </>
                )}

            </Form>
        </AppLayout>
    );
}
