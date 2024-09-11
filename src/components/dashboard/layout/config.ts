import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'Dashboards', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'Consultar', title: 'Consultar', href: paths.dashboard.Consult, icon: 'ListMagnifyingGlass' },
  { key: 'Clients', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
  { key: 'Config', title: 'Configurações', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'Conta', title: 'Conta', href: paths.dashboard.account, icon: 'user' },
] satisfies NavItemConfig[];
