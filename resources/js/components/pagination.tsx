import { Link } from '@inertiajs/react';
import { type PaginationLink as PageLink } from '@/types';
import { cn } from '@/lib/utils';

export default function Pagination({ links }: { links?: PageLink[] }) {
    if (!links || links.length <= 3) return null; // usually only one page

    return (
        <nav className="mt-4 flex items-center justify-center" aria-label="Pagination">
            <ul className="flex flex-wrap items-center gap-2">
                {links.map((link, idx) => {
                    const isDisabled = !link.url;
                    const isActive = link.active;
                    return (
                        <li key={`${idx}-${link.label}`}>
                            {isDisabled ? (
                                <span
                                    className={cn(
                                        'select-none rounded-md border px-3 py-1 text-sm text-muted-foreground',
                                        'bg-muted/20 border-transparent'
                                    )}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <Link
                                    href={link.url ?? undefined}
                                    prefetch
                                    preserveScroll
                                    className={cn(
                                        'rounded-md border px-3 py-1 text-sm',
                                        isActive
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-background text-foreground border-border hover:bg-muted'
                                    )}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

