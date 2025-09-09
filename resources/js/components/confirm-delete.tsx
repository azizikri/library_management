import { Form } from '@inertiajs/react'
import type { Method } from '@inertiajs/core'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

type ConfirmDeleteProps = {
    form: { action: string; method: Method | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' }
    entityLabel: string
    name?: string
    triggerLabel?: string
    confirmLabel?: string
    title?: string
    description?: string
    triggerVariant?: 'default' | 'destructive' | 'secondary' | 'outline' | 'ghost' | 'link'
}

export default function ConfirmDelete({ form, entityLabel, name, triggerLabel, confirmLabel, title, description, triggerVariant = 'destructive' }: ConfirmDeleteProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={triggerVariant}>{triggerLabel ?? 'Delete'}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title ?? `Delete ${entityLabel}?`}</DialogTitle>
                    <DialogDescription>
                        {description ?? (
                            name ? (
                                <span>
                                    You are about to delete <b>{name}</b>. This action cannot be undone.
                                </span>
                            ) : (
                                <span>This action cannot be undone.</span>
                            )
                        )}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary" type="button">Cancel</Button>
                    </DialogClose>
                    <Form {...form} className="inline">
                        {({ processing }) => (
                            <Button variant={triggerVariant} type="submit" disabled={processing}>
                                {processing ? 'Working…' : (confirmLabel ?? 'Confirm delete')}
                            </Button>
                        )}
                    </Form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
