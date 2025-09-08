import AppLayout from '@/layouts/app-layout';
import { Form, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { useBreadcrumbs } from '@/lib/breadcrumbs';
import { index as usersIndex, create as usersCreate, store as usersStore } from "@/routes/users";
export default function UsersCreate() {
    const breadcrumbs = useBreadcrumbs(
        { title: 'Users', href: usersIndex() },
        { title: 'Create', href: usersCreate() },
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />
            <Form {...usersStore.form()} disableWhileProcessing className="max-w-3xl space-y-6 p-4">
                {({ processing, errors }) => (
                    <>
                        <input type="hidden" name="_token" value={(document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content ?? ''} />
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" required aria-invalid={Boolean(errors.name)} />
                                <InputError message={errors.name} />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" required aria-invalid={Boolean(errors.email)} />
                                <InputError message={errors.email} />
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" required aria-invalid={Boolean(errors.password)} />
                                <InputError message={errors.password} />
                            </div>
                        </div>
                        <Button type="submit" disabled={processing}>Create</Button>
                    </>
                )}
            </Form>
        </AppLayout>
    );
}
