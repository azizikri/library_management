import { usePage } from '@inertiajs/react';
import type { BreadcrumbItem, SharedData } from '@/types';

export function useRootBreadcrumb(): BreadcrumbItem {
    const { auth } = usePage<SharedData>().props;
    const role = auth?.user?.role ?? 'user';

    return role === 'admin'
        ? { title: 'Dashboard', href: '/dashboard' }
        : { title: 'Borrowings', href: '/borrowings' };
}

export function useBreadcrumbs(...tail: BreadcrumbItem[]): BreadcrumbItem[] {
    const root = useRootBreadcrumb();
    const items: BreadcrumbItem[] = [root, ...tail];
    // De-duplicate by href while keeping order
    const seen = new Set<string>();
    return items.filter((item) => {
        const key = typeof item.href === 'string' ? item.href : JSON.stringify(item.href);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

