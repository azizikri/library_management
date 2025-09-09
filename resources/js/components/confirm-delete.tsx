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
}

export default function ConfirmDelete({ form, entityLabel, name }: ConfirmDeleteProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete {entityLabel}?</DialogTitle>
                    <DialogDescription>
                        {name ? (
                            <span>
                                You are about to delete <b>{name}</b>. This action cannot be undone.
                            </span>
                        ) : (
                            <span>This action cannot be undone.</span>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary" type="button">Cancel</Button>
                    </DialogClose>
                    <Form {...form} className="inline">
                        {({ processing }) => (
                            <Button variant="destructive" type="submit" disabled={processing}>
                                {processing ? 'Deleting…' : 'Confirm delete'}
                            </Button>
                        )}
                    </Form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
