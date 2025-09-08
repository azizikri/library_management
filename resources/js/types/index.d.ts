import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    role?: 'admin' | 'user';
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

// Domain types
export interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    category: string;
    daily_rental_price: number;
    stock_quantity: number;
    available_quantity: number;
    description?: string | null;
    created_at?: string;
    updated_at?: string;
}

export type BorrowStatus = 'active' | 'returned' | 'overdue';

export interface Borrowing {
    id: number;
    user_id: number;
    book_id: number;
    borrowed_date: string; // YYYY-MM-DD
    return_date: string; // YYYY-MM-DD
    actual_return_date?: string | null;
    days_borrowed: number;
    total_cost: number;
    status: BorrowStatus;
    user?: User;
    book?: Book;
    created_at?: string;
    updated_at?: string;
}

// Pagination types (Inertia + Laravel paginator shape)
export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    path: string;
}

export interface Paginated<T> {
    data: T[];
    links?: PaginationLink[];
    meta?: PaginationMeta;
}

// Filters
export interface BookFilters {
    search?: string;
    category?: string;
}

export interface ReportFilters {
    start_date?: string; // YYYY-MM-DD
    end_date?: string; // YYYY-MM-DD
}

// Dashboard
export interface DashboardMetrics {
    total_books: number;
    total_copies: number;
    available_copies: number;
    active_borrowings: number;
    overdue_borrowings: number;
    revenue_30d: number;
}

export interface TopBook {
    title: string;
    count: number;
}
