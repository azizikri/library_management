import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatIDR(value: number | string | null | undefined) {
    const n = Number(value ?? 0);
    try {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(n);
    } catch (error) {
        // Fallback formatting
        console.error('Error formatting IDR:', error);
        return `Rp ${Math.round(n).toLocaleString('id-ID')}`;
    }
}

export function formatDate(value: string | Date | null | undefined, opts?: Intl.DateTimeFormatOptions) {
    if (!value) return '';
    const d = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(d.getTime())) return '';
    const fmt: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        ...opts,
    };
    return new Intl.DateTimeFormat('id-ID', fmt).format(d);
}

export function csrfHeaders(base?: HeadersInit): HeadersInit {
    const headers: Record<string, string> = {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
    };

    const meta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
    if (meta?.content) headers['X-CSRF-TOKEN'] = meta.content;

    const xsrfCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
    if (xsrfCookie) headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfCookie);

    return { ...headers, ...(base as Record<string, string>) };
}
