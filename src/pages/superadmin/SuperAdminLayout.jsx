"use client"

import { DollarSignIcon, FileTextIcon, LayoutDashboardIcon, SettingsIcon, ShieldAlertIcon, UserCogIcon, UsersIcon } from "lucide-react"
import { LayoutWrapper } from "../../components/layout-wrapper"

const superAdminNavigation = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        to: "/superadmin/dashboard",
        icon: LayoutDashboardIcon,
      },
      {
        title: "Reports",
        to: "/superadmin/reports",
        icon: FileTextIcon,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "All Admins",
        to: "/superadmin/alladmins",
        icon: UserCogIcon,
      },
      {
        title: "All Users",
        to: "/superadmin/allusers",
        icon: UsersIcon,
      },
      {
        title: "Permissions",
        to: "/superadmin/permissions",
        icon: ShieldAlertIcon,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Settings",
        to: "/superadmin/settings",
        icon: SettingsIcon,
      },
      {
        title: "Billing",
        to: "/superadmin/billing",
        icon: DollarSignIcon,
      },
    ],
  },
]

export default function SuperAdminLayout({ children }) {
  return (
    <LayoutWrapper navigation={superAdminNavigation} userRole="superAdmin" portalTitle="Super Admin Portal">
      {children}
    </LayoutWrapper>
  )
}

