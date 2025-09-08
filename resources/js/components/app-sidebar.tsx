import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as borrowingsIndex } from "@/routes/borrowings"
import { index as booksIndex } from "@/routes/books"
import { index as reportsIndex } from "@/routes/reports"
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users as UsersIcon } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const role = auth?.user?.role ?? 'user';

    const mainNavItems: NavItem[] = [];

    if (role === 'admin') {
        mainNavItems.push({ title: 'Dashboard', href: dashboard(), icon: LayoutGrid });
        mainNavItems.push({ title: 'Books', href: booksIndex(), icon: BookOpen });
        mainNavItems.push({ title: 'Users', href: '/users', icon: UsersIcon });
    }

    if (role === 'user') {
        mainNavItems.push({ title: 'Borrowings', href: borrowingsIndex(), icon: Folder });
    }

    // Shared
    mainNavItems.push({ title: 'Reports', href: reportsIndex(), icon: BookOpen });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={role === 'admin' ? dashboard() : borrowingsIndex()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
