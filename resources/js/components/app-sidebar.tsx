import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Folder,
    LayoutGrid,
    ListOrdered,
    Pizza,
    Users,
    ShieldCheck,
} from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';
import { dashboard } from '@/routes';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
        icon: LayoutGrid,
    },
    {
        title: 'Orders',
        href: '/orders',
        icon: ListOrdered,
    },
    {
        title: 'Menu',
        href: '/products',
        icon: Pizza,
    },
    {
        title: 'Pizza Sizes',
        href: '/pizza-sizes',
        icon: Pizza,
    },
    {
        title: 'Toppings',
        href: '/toppings',
        icon: Pizza,
    },
    {
        title: 'Customers',
        href: '/customers',
        icon: Users,
    },
    {
        title: 'Staff Management',
        href: '/staff',
        icon: ShieldCheck,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Help Center',
        href: '#',
        icon: Folder,
    },
    {
        title: 'Enterprise Docs',
        href: '#',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const userRole = (auth.user?.role || 'Staff').toLowerCase();

    // Role-based navigation filtering
    const filteredNavItems = mainNavItems.filter(item => {
        if (userRole === 'admin') return true;

        if (userRole === 'manager') {
            return item.title !== 'Staff Management';
        }

        if (userRole === 'chef') {
            return ['Dashboard', 'Orders', 'Menu'].includes(item.title);
        }

        if (userRole === 'receptionist') {
            return ['Dashboard', 'Orders', 'Customers'].includes(item.title);
        }

        // Default: Staff only see Dashboard and Orders
        return ['Dashboard', 'Orders'].includes(item.title);
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
