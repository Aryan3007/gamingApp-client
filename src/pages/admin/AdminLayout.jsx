/* eslint-disable react/prop-types */
import { BellIcon, FileTextIcon, LayoutDashboardIcon, MessageSquareIcon, SettingsIcon, UsersIcon } from "lucide-react"
import { LayoutWrapper } from "../../components/layout-wrapper"


const adminNavigation = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        to: "/admin/dashboard",
        icon: LayoutDashboardIcon,
      },
      {
        title: "Reports",
        to: "/admin/reports",
        icon: FileTextIcon,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Users",
        to: "/admin/users",
        icon: UsersIcon,
      },
      {
        title: "Withdrawls",
        to: "/admin/withdrawl",
        icon: FileTextIcon,
      },
      {
        title: "Deposite",
        to: "/admin/deposite",
        icon: FileTextIcon,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Settings",
        to: "/admin/settings",
        icon: SettingsIcon,
      },
    ],
  },
]

export default function AdminLayout({ children }) {
  return (
    <LayoutWrapper navigation={adminNavigation} userRole="admin" portalTitle="Admin Portal">
      {children}
    </LayoutWrapper>
  )
}

